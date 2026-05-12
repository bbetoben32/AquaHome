from sqlalchemy import Column, Integer, String, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from datetime import datetime
from app.core.database import Base

class Maintenance(Base):
    __tablename__ = "maintenance"

    id                  = Column(Integer, primary_key=True, index=True)
    device_id           = Column(Integer, ForeignKey("devices.id"), nullable=False)
    fecha_mantenimiento = Column(DateTime, nullable=False)
    notas               = Column(String, nullable=True)
    created_at          = Column(DateTime, default=datetime.utcnow)

    device = relationship("Device", back_populates="maintenance")