from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.core.dependencies import get_current_user
from app.models.user import User
from app.schemas.reading import ReadingCreate, ReadingResponse
from app.services.reading_service import create_reading, get_readings_by_device, evaluate_water_quality
from app.services.device_service import get_device_by_id
from datetime import datetime, timedelta
from app.models.reading import Reading
from datetime import datetime, timedelta, timezone

router = APIRouter()

@router.post("/", response_model=ReadingResponse)
def add_reading(
    reading_data: ReadingCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    device = get_device_by_id(db, reading_data.device_id)
    if not device:
        raise HTTPException(status_code=404, detail="Dispositivo no encontrado")
    if device.owner_id != current_user.id:
        raise HTTPException(status_code=403, detail="No tienes permiso para este dispositivo")
    return create_reading(db, reading_data)

@router.get("/device/{device_id}", response_model=list[ReadingResponse])
def list_readings(
    device_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
    skip: int = Query(default=0, ge=0),
    limit: int = Query(default=10, le=100)
):
    device = get_device_by_id(db, device_id)
    if not device:
        raise HTTPException(status_code=404, detail="Dispositivo no encontrado")
    if device.owner_id != current_user.id:
        raise HTTPException(status_code=403, detail="No tienes permiso para ver estas lecturas")
    return get_readings_by_device(db, device_id, skip, limit)

@router.get("/device/{device_id}/status")
def water_status(
    device_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    device = get_device_by_id(db, device_id)
    if not device:
        raise HTTPException(status_code=404, detail="Dispositivo no encontrado")
    if device.owner_id != current_user.id:
        raise HTTPException(status_code=403, detail="No tienes permiso para ver este estado")
    readings = get_readings_by_device(db, device_id, skip=0, limit=1)
    if not readings:
        raise HTTPException(status_code=404, detail="No hay lecturas para este dispositivo")
    return evaluate_water_quality(readings[-1])

from datetime import datetime, timedelta

@router.get("/device/{device_id}/history")
def get_history(
    device_id: int,
    periodo: str = "dia",
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    device = get_device_by_id(db, device_id)
    if not device:
        raise HTTPException(status_code=404, detail="Dispositivo no encontrado")
    if device.owner_id != current_user.id:
        raise HTTPException(status_code=403, detail="No tienes permiso")

    ahora_utc = datetime.utcnow()
    
    if periodo == "dia":
        # Inicio del día de hoy en hora Colombia (UTC-5) convertido a UTC
        ahora_colombia = ahora_utc - timedelta(hours=5)
        inicio_dia_colombia = ahora_colombia.replace(hour=0, minute=0, second=0, microsecond=0)
        desde = inicio_dia_colombia + timedelta(hours=5)  # convertir de vuelta a UTC
    elif periodo == "mes":
        desde = ahora_utc - timedelta(days=30)
    elif periodo == "año":
        desde = ahora_utc - timedelta(days=365)
    else:
        desde = ahora_utc - timedelta(hours=24)

    lecturas = db.query(Reading).filter(
        Reading.device_id == device_id,
        Reading.timestamp >= desde
    ).order_by(Reading.timestamp.asc()).all()

    return lecturas