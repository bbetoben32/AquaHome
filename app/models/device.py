from sqlalchemy import Column, Integer, String, Boolean, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from datetime import datetime
from app.core.database import Base

class Device(Base):
    __tablename__ = "devices"
    id          = Column(Integer, primary_key=True, index=True)
    name        = Column(String, nullable=False)
    location    = Column(String, nullable=True)
    device_type = Column(String, nullable=True)  # ← NUEVO: "alberca" o "tanque_elevado"
    is_active   = Column(Boolean, default=True)
    created_at  = Column(DateTime, default=datetime.utcnow)
    last_seen   = Column(DateTime, nullable=True)
    owner_id    = Column(Integer, ForeignKey("users.id"), nullable=False)
    owner       = relationship("User", back_populates="devices")
    readings    = relationship("Reading", back_populates="device")
    alerts      = relationship("Alert", back_populates="device")
    maintenance = relationship("Maintenance", back_populates="device")