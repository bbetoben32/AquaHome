from sqlalchemy.orm import Session
from sqlalchemy import desc
from app.models.alert import Alert
from datetime import datetime, timedelta

UMBRAL_CAMBIO = {
    "pH":               0.5,
    "Temperatura":      2.0,
    "Turbidez":         1.0,
    "Sólidos disueltos": 50.0,
}

def create_alert(db: Session, device_id: int, mensaje: str, estado: str, tipo: str, valor: float = None, parametro: str = None):
    hace_X_horas = datetime.utcnow() - timedelta(hours=3)

    # Busca la última alerta del mismo parámetro
    ultima = db.query(Alert).filter(
        Alert.device_id  == device_id,
        Alert.mensaje.like(f"{parametro}%"),
        Alert.created_at >= hace_X_horas
    ).order_by(desc(Alert.created_at)).first()

    if ultima and valor is not None and parametro is not None:
        # Extraer el valor anterior del mensaje
        try:
            valor_anterior = float(ultima.mensaje.split("en ")[-1].split(" ")[0])
            umbral = UMBRAL_CAMBIO.get(parametro, 1.0)
            cambio = abs(valor - valor_anterior)
            if cambio < umbral:
                return None  # no ha cambiado suficiente
        except:
            return None

    alert = Alert(
        device_id = device_id,
        mensaje   = mensaje,
        estado    = estado,
        tipo      = tipo,
    )
    db.add(alert)
    db.commit()
    db.refresh(alert)
    return alert

def marcar_leida(db: Session, alert_id: int, device_id: int):
    alert = db.query(Alert).filter(
        Alert.id        == alert_id,
        Alert.device_id == device_id
    ).first()
    if alert:
        alert.leida = True
        db.commit()
        db.refresh(alert)
    return alert

def get_alerts_today(db: Session, device_id: int):
    hoy = datetime.utcnow().replace(hour=0, minute=0, second=0, microsecond=0)
    return db.query(Alert).filter(
        Alert.device_id  == device_id,
        Alert.created_at >= hoy
    ).order_by(desc(Alert.created_at)).all()  # ← todas, leídas y no leídas

def get_alerts_today_unread(db: Session, device_id: int):
    hoy = datetime.utcnow().replace(hour=0, minute=0, second=0, microsecond=0)
    return db.query(Alert).filter(
        Alert.device_id  == device_id,
        Alert.created_at >= hoy,
        Alert.leida      == False  # ← solo no leídas para notificaciones
    ).order_by(desc(Alert.created_at)).all()

def get_alerts_week_unread(db: Session, device_id: int):
    semana = datetime.utcnow() - timedelta(days=7)
    return db.query(Alert).filter(
        Alert.device_id  == device_id,
        Alert.created_at >= semana,
        Alert.leida      == False
    ).order_by(desc(Alert.created_at)).all()

def get_alerts_week(db: Session, device_id: int):
    semana = datetime.utcnow() - timedelta(days=7)
    return db.query(Alert).filter(
        Alert.device_id  == device_id,
        Alert.created_at >= semana
    ).order_by(desc(Alert.created_at)).all()