from sqlalchemy.orm import Session
from sqlalchemy import desc
from app.models.maintenance import Maintenance
from app.models.alert import Alert
from datetime import datetime, timedelta

DIAS_BASE = 150  # 5 meses

# Parámetros que afectan la salud si están fuera de rango
PARAMETROS_CRITICOS = ["pH", "Temperatura", "Turbidez", "Sólidos disueltos"]

def get_ultimo_mantenimiento(db: Session, device_id: int):
    return db.query(Maintenance).filter(
        Maintenance.device_id == device_id
    ).order_by(desc(Maintenance.fecha_mantenimiento)).first()


def create_maintenance(db: Session, device_id: int, fecha: datetime, notas: str = None):
    # Busca si ya existe un registro para este dispositivo
    existente = db.query(Maintenance).filter(
        Maintenance.device_id == device_id
    ).first()

    if existente:
        existente.fecha_mantenimiento = fecha
        existente.notas               = notas
        existente.created_at          = datetime.utcnow()
        db.commit()
        db.refresh(existente)
        return existente

    m = Maintenance(
        device_id           = device_id,
        fecha_mantenimiento = fecha,
        notas               = notas,
    )
    db.add(m)
    db.commit()
    db.refresh(m)
    return m

def calcular_dias_restantes(db: Session, device_id: int) -> dict:
    ultimo = get_ultimo_mantenimiento(db, device_id)

    if not ultimo:
        # nunca ha tenido mantenimiento — usa created_at del dispositivo
        from app.models.device import Device
        device = db.query(Device).filter(Device.id == device_id).first()
        fecha_inicio = device.created_at if device else datetime.utcnow()
    else:
        fecha_inicio = ultimo.fecha_mantenimiento

    # ── Contar alertas críticas en los últimos 30 días ────────────
    hace_30_dias = datetime.utcnow() - timedelta(days=30)
    alertas_criticas = db.query(Alert).filter(
        Alert.device_id  == device_id,
        Alert.created_at >= hace_30_dias,
        Alert.tipo       == "parametro"
    ).count()

    # ── Reducir días según alertas críticas ───────────────────────
    # cada alerta crítica reduce 2 días del ciclo
    reduccion = min(alertas_criticas * 2, 60)  # máximo 60 días de reducción
    dias_ciclo = DIAS_BASE - reduccion

    dias_transcurridos = (datetime.utcnow() - fecha_inicio).days
    dias_restantes = max(dias_ciclo - dias_transcurridos, 0)

    return {
        "dias_restantes":   dias_restantes,
        "dias_transcurridos": dias_transcurridos,
        "total_dias":       dias_ciclo,
        "ultimo_mantenimiento": ultimo.fecha_mantenimiento.isoformat() if ultimo else None,
        "alertas_criticas": alertas_criticas,
        "reduccion_dias":   reduccion,
    }