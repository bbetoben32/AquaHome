from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.core.dependencies import get_current_user
from app.models.user import User
from app.schemas.device import DeviceCreate, DeviceResponse
from app.services.device_service import create_device, get_devices_by_user, get_device_by_id, deactivate_device

router = APIRouter()

@router.post("/", response_model=DeviceResponse)
def register_device(
    device_data: DeviceCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    return create_device(db, device_data, current_user.id)

@router.get("/", response_model=list[DeviceResponse])
def list_devices(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
    skip: int = Query(default=0, ge=0),
    limit: int = Query(default=10, le=100)
):
    return get_devices_by_user(db, current_user.id, skip, limit)

@router.get("/{device_id}", response_model=DeviceResponse)
def get_device(
    device_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    device = get_device_by_id(db, device_id)
    if not device:
        raise HTTPException(status_code=404, detail="Dispositivo no encontrado")
    if device.owner_id != current_user.id:
        raise HTTPException(status_code=403, detail="No tienes permiso para ver este dispositivo")
    return device

@router.delete("/{device_id}", response_model=DeviceResponse)
def delete_device(
    device_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    device = get_device_by_id(db, device_id)
    if not device:
        raise HTTPException(status_code=404, detail="Dispositivo no encontrado")
    if device.owner_id != current_user.id:
        raise HTTPException(status_code=403, detail="No tienes permiso para eliminar este dispositivo")
    return deactivate_device(db, device_id)