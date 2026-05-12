from sqlalchemy.orm import Session
from sqlalchemy import desc
from app.models.reading import Reading
from app.schemas.reading import ReadingCreate

WATER_QUALITY_RANGES = {
    "ph": (6.5, 9.0),
    "temperature": (0.0, 30.0),
    "turbidity": (0.0, 2.0),
    "tds": (0.0, 500.0)
}

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

def evaluate_water_quality(reading: Reading):
    status = "APTA"
    alerts = []

    checks = {
        "ph": reading.ph,
        "temperature": reading.temperature,
        "turbidity": reading.turbidity,
        "tds": reading.tds
    }

    for param, value in checks.items():
        if value is not None:
            min_val, max_val = WATER_QUALITY_RANGES[param]
            if not (min_val <= value <= max_val):
                alerts.append(f"{param} fuera de rango: {value}")
                status = "NO APTA"

    return {"status": status, "alerts": alerts}