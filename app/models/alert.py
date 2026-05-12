from sqlalchemy import Column, Integer, String, Boolean, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from datetime import datetime
from app.core.database import Base

class Alert(Base):
    __tablename__ = "alerts"

    id        = Column(Integer, primary_key=True, index=True)
    device_id = Column(Integer, ForeignKey("devices.id"), nullable=False)
    mensaje   = Column(String, nullable=False)
    estado    = Column(String, nullable=False)
    tipo      = Column(String, nullable=False)
    leida     = Column(Boolean, default=False)
    created_at = Column(DateTime, default=datetime.utcnow)

    device = relationship("Device", back_populates="alerts")