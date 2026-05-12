from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.core.dependencies import get_current_user
from app.models.user import User
from app.models.device import Device
from app.services.alert_service import get_alerts_today, get_alerts_week, delete_alert
from app.services.device_service import get_device_by_id

router = APIRouter()

@router.get("/device/{device_id}/today")
def alerts_today(
    device_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    device = get_device_by_id(db, device_id)
    if not device:
        raise HTTPException(status_code=404, detail="Dispositivo no encontrado")
    if device.owner_id != current_user.id:
        raise HTTPException(status_code=403, detail="Sin permiso")
    return get_alerts_today(db, device_id)

@router.get("/device/{device_id}/week")
def alerts_week(
    device_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    device = get_device_by_id(db, device_id)
    if not device:
        raise HTTPException(status_code=404, detail="Dispositivo no encontrado")
    if device.owner_id != current_user.id:
        raise HTTPException(status_code=403, detail="Sin permiso")
    return get_alerts_week(db, device_id)

@router.delete("/{alert_id}")
def remove_alert(
    alert_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    device = db.query(Device).filter(Device.owner_id == current_user.id).first()
    if not device:
        raise HTTPException(status_code=404, detail="Sin dispositivo")
    alert = delete_alert(db, alert_id, device.id)
    if not alert:
        raise HTTPException(status_code=404, detail="Alerta no encontrada")
    return {"ok": True}