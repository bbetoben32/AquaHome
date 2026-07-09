from sqlalchemy.orm import Session
from sqlalchemy import desc
from app.models.reading import Reading
from app.schemas.reading import ReadingCreate

WATER_QUALITY_RANGES = {
    "ph":          (6.5, 9.0),
    "temperature": (0.0, 30.0),
    "turbidity":   (0.0, 2.0),
    "tds":         (0.0, 500.0)
}


WATER_QUALITY_PRECAUCION = {
    "ph":          (6.2, 9.3),   
    "temperature": (0.0, 33.0),  
    "turbidity":   (0.0, 5.0),   
    "tds":         (0.0, 600.0), 
}

def evaluate_water_quality(reading: Reading):
    alerts = []
    criticos = 0
    precauciones = 0

    checks = {
        "ph":          reading.ph,
        "temperature": reading.temperature,
        "turbidity":   reading.turbidity,
        "tds":         reading.tds
    }

    for param, value in checks.items():
        if value is None:
            continue

        min_ok,  max_ok  = WATER_QUALITY_RANGES[param]
        min_pre, max_pre = WATER_QUALITY_PRECAUCION[param]

        if min_ok <= value <= max_ok:
            continue  # dentro del rango normal
        elif min_pre <= value <= max_pre:
            # fuera del rango ideal pero dentro de tolerancia
            precauciones += 1
            alerts.append(f"{param} en zona de precaución: {value}")
        else:
            # claramente fuera de rango
            criticos += 1
            alerts.append(f"{param} fuera de rango crítico: {value}")

    if criticos >= 1:
        status = "NO APTA"
    elif precauciones >= 1:
        status = "PRECAUCION"
    else:
        status = "APTA"

    return {"status": status, "alerts": alerts}

def create_reading(db: Session, reading_data: ReadingCreate):
    new_reading = Reading(
        ph=reading_data.ph,
        temperature=reading_data.temperature,
        turbidity=reading_data.turbidity,
        tds=reading_data.tds,
        device_id=reading_data.device_id
    )
    db.add(new_reading)
    db.commit()
    db.refresh(new_reading)
    return new_reading

def get_readings_by_device(db: Session, device_id: int, skip: int = 0, limit: int = 10):
    return db.query(Reading).filter(
        Reading.device_id == device_id
    ).order_by(desc(Reading.timestamp)).offset(skip).limit(limit).all()

def get_last_reading_time(db: Session, device_id: int):
    ultima = db.query(Reading).filter(
        Reading.device_id == device_id
    ).order_by(desc(Reading.timestamp)).first()
    return ultima.timestamp if ultima else None

