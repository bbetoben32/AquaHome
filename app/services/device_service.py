from sqlalchemy.orm import Session
from app.models.device import Device
from app.schemas.device import DeviceCreate
from datetime import datetime

def create_device(db: Session, device_data: DeviceCreate, owner_id: int):
    new_device = Device(
        name=device_data.name,
        location=device_data.location,
        device_type=device_data.device_type,
        description=device_data.description,  # ← NUEVO
        owner_id=owner_id,
        last_seen=datetime.utcnow(),
    )
    db.add(new_device)
    db.commit()
    db.refresh(new_device)
    return new_device

def get_devices_by_user(db: Session, owner_id: int, skip: int = 0, limit: int = 10):
    return db.query(Device).filter(Device.owner_id == owner_id).offset(skip).limit(limit).all()

def get_device_by_id(db: Session, device_id: int):
    return db.query(Device).filter(Device.id == device_id).first()


def update_last_seen(db: Session, device_id: int):
    device = db.query(Device).filter(Device.id == device_id).first()
    if not device:
        return None
    device.last_seen  = datetime.utcnow()
    device.is_active  = True
    db.commit()
    db.refresh(device)
    return device

def create_device(db: Session, device_data: DeviceCreate, owner_id: int):
    new_device = Device(
        name=device_data.name,
        location=device_data.location,
        device_type=device_data.device_type,  # ← AGREGA ESTA LÍNEA
        owner_id=owner_id,
        last_seen=datetime.utcnow(),
    )
    db.add(new_device)
    db.commit()
    db.refresh(new_device)
    return new_device

def check_device_timeout(db: Session, device_id: int, timeout_seconds: int = 60) -> bool:
    device = db.query(Device).filter(Device.id == device_id).first()
    if not device or not device.last_seen:
        return False
    diff = (datetime.utcnow() - device.last_seen).total_seconds()
    return diff > timeout_seconds