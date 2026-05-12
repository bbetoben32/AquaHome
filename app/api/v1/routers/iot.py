from fastapi import APIRouter, Depends, HTTPException, Header
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.core.config import settings
from app.schemas.reading import ReadingCreate
from app.services.reading_service import create_reading, evaluate_water_quality
from app.services.device_service import update_last_seen, get_device_by_id
from app.services.alert_service import create_alert
from app.core.websocket_manager import manager
from datetime import datetime

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

    reading = create_reading(db, data)
    estado  = evaluate_water_quality(reading)

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
            alerta = create_alert(db, data.device_id, mensaje, estado_texto, "parametro", valor=valor, parametro=NOMBRES[param])
            if alerta:
                alertas_generadas.append({
                    "id":         alerta.id,
                    "mensaje":    alerta.mensaje,
                    "estado":     alerta.estado,
                    "tipo":       alerta.tipo,
                    "created_at": alerta.created_at.isoformat(),
                    "device_id":  alerta.device_id,
                })

    await manager.broadcast_device(data.device_id, {
        "event":       "nueva_lectura",
        "device_id":   data.device_id,
        "ph":          reading.ph,
        "temperature": reading.temperature,
        "turbidity":   reading.turbidity,
        "tds":         reading.tds,
        "timestamp":   reading.timestamp.isoformat(),
        "status":      estado["status"],
        "alerts":      estado["alerts"],
    })

    if alertas_generadas:
        await manager.broadcast_device(data.device_id, {
            "event":   "nueva_alerta",
            "alertas": alertas_generadas,
        })

    return {"message": "Datos recibidos correctamente", "reading_id": reading.id}

@router.post("/stream")
async def stream_sensor_data(
    data: ReadingCreate,
    x_device_key: str = Header(None),
):
    if x_device_key != settings.DEVICE_SECRET_KEY:
        raise HTTPException(status_code=401, detail="Clave inválida")

    # evaluar calidad sin guardar en BD
    from app.models.reading import Reading
    lectura_temp = Reading(
        ph          = data.ph,
        temperature = data.temperature,
        turbidity   = data.turbidity,
        tds         = data.tds,
        device_id   = data.device_id,
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