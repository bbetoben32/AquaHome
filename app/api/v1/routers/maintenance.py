from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.core.dependencies import get_current_user
from app.models.user import User
from app.services.maintenance_service import calcular_dias_restantes, create_maintenance, get_ultimo_mantenimiento
from app.services.device_service import get_device_by_id
from datetime import datetime
from pydantic import BaseModel
from typing import Optional

router = APIRouter()

class MaintenanceCreate(BaseModel):
    fecha: str
    notas: Optional[str] = None

@router.get("/device/{device_id}")
def get_maintenance(
    device_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    device = get_device_by_id(db, device_id)
    if not device:
        raise HTTPException(status_code=404, detail="Dispositivo no encontrado")
    if device.owner_id != current_user.id:
        raise HTTPException(status_code=403, detail="Sin permiso")
    return calcular_dias_restantes(db, device_id)

@router.post("/device/{device_id}")
def register_maintenance(
    device_id: int,
    data: MaintenanceCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    device = get_device_by_id(db, device_id)
    if not device:
        raise HTTPException(status_code=404, detail="Dispositivo no encontrado")
    if device.owner_id != current_user.id:
        raise HTTPException(status_code=403, detail="Sin permiso")
    fecha = datetime.fromisoformat(data.fecha)
    m = create_maintenance(db, device_id, fecha, data.notas)
    return calcular_dias_restantes(db, device_id)