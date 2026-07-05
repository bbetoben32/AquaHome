from fastapi import APIRouter, Depends, HTTPException, Header
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.core.config import settings
from app.schemas.reading import ReadingCreate
from app.services.reading_service import create_reading, evaluate_water_quality, get_last_reading_time
from app.services.device_service import update_last_seen, get_device_by_id
from app.services.alert_service import create_alert
from app.core.websocket_manager import manager
from app.models.reading import Reading
from datetime import datetime, timedelta

router = APIRouter()

RANGOS = {
    "ph":          (6.5, 9.0),
    "temperature": (0.0, 30.0),
    "turbidity":   (0.0, 2.0),
    "tds":         (0.0, 500.0),
}

NOMBRES = {
    "ph":          "pH",
    "temperature": "Temperatura",
    "turbidity":   "Turbidez",
    "tds":         "Sólidos disueltos",
}

UNIDADES = {
    "ph":          "",
    "temperature": "°C",
    "turbidity":   "NTU",
    "tds":         "ppm",
}

@router.post("/data")
async def receive_sensor_data(
    data: ReadingCreate,
    x_device_key: str = Header(None),
    db: Session = Depends(get_db)
):
    if x_device_key != settings.DEVICE_SECRET_KEY:
        raise HTTPException(status_code=401, detail="Clave de dispositivo inválida")

    device = get_device_by_id(db, data.device_id)
    if not device:
        raise HTTPException(status_code=404, detail="Dispositivo no encontrado")

    # ── Evaluar calidad ANTES de guardar ──────────────────────────
    lectura_temp = Reading(
        ph=data.ph,
        temperature=data.temperature,
        turbidity=data.turbidity,
        tds=data.tds,
        device_id=data.device_id,
    )
    estado = evaluate_water_quality(lectura_temp)

    # ── Decidir si guardar en BD ──────────────────────────────────
    hay_alerta = len(estado["alerts"]) > 0
    ultima_lectura = get_last_reading_time(db, data.device_id)
    tiempo_suficiente = (
        ultima_lectura is None or
        datetime.utcnow() - ultima_lectura >= timedelta(minutes=30)
    )

    reading = None
    if hay_alerta or tiempo_suficiente:
        reading = create_reading(db, data)

    # ── Actualizar last_seen ──────────────────────────────────────
    update_last_seen(db, data.device_id)

    # ── Broadcast en tiempo real siempre ─────────────────────────
    await manager.broadcast_device(data.device_id, {
        "event":       "nueva_lectura",
        "device_id":   data.device_id,
        "ph":          data.ph,
        "temperature": data.temperature,
        "turbidity":   data.turbidity,
        "tds":         data.tds,
        "timestamp":   datetime.utcnow().isoformat(),
        "status":      estado["status"],
        "alerts":      estado["alerts"],
    })

    # ── Alertas solo si se guardó la lectura ─────────────────────
    if reading and hay_alerta:
        valores = {
            "ph":          data.ph,
            "temperature": data.temperature,
            "turbidity":   data.turbidity,
            "tds":         data.tds,
        }

        alertas_generadas = []
        for param, valor in valores.items():
            if valor is None:
                continue
            min_val, max_val = RANGOS[param]
            if not (min_val <= valor <= max_val):
                estado_texto = "alto" if valor > max_val else "bajo"
                mensaje = f"{NOMBRES[param]} en {valor}{UNIDADES[param]}"
                alerta = create_alert(
                    db, data.device_id, mensaje, estado_texto,
                    "parametro", valor=valor, parametro=NOMBRES[param]
                )
                if alerta:
                    alertas_generadas.append({
                        "id":         alerta.id,
                        "mensaje":    alerta.mensaje,
                        "estado":     alerta.estado,
                        "tipo":       alerta.tipo,
                        "created_at": alerta.created_at.isoformat(),
                        "device_id":  alerta.device_id,
                    })

        if alertas_generadas:
            await manager.broadcast_device(data.device_id, {
                "event":   "nueva_alerta",
                "alertas": alertas_generadas,
            })

    return {"message": "Datos recibidos correctamente", "reading_id": reading.id if reading else None}


@router.post("/stream")
async def stream_sensor_data(
    data: ReadingCreate,
    x_device_key: str = Header(None),
):
    if x_device_key != settings.DEVICE_SECRET_KEY:
        raise HTTPException(status_code=401, detail="Clave inválida")

    lectura_temp = Reading(
        ph=data.ph,
        temperature=data.temperature,
        turbidity=data.turbidity,
        tds=data.tds,
        device_id=data.device_id,
    )
    estado = evaluate_water_quality(lectura_temp)

    await manager.broadcast_device(data.device_id, {
        "event":       "nueva_lectura",
        "device_id":   data.device_id,
        "ph":          data.ph,
        "temperature": data.temperature,
        "turbidity":   data.turbidity,
        "tds":         data.tds,
        "timestamp":   datetime.utcnow().isoformat(),
        "status":      estado["status"],
        "alerts":      estado["alerts"],
    })

    return {"ok": True}


@router.post("/heartbeat")
async def heartbeat(
    data: dict,
    db: Session = Depends(get_db)
):
    device_id = data.get("device_id")
    print(f"Heartbeat recibido - device_id: {device_id}")
    device = update_last_seen(db, device_id)
    print(f"Device actualizado: {device}")
    if device:
        await manager.broadcast_device(device_id, {
            "event":     "status",
            "device_id": device_id,
            "is_active": True,
            "last_seen": device.last_seen.isoformat(),
        })
    return {"ok": True}