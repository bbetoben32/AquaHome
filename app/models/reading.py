from sqlalchemy import Column, Integer, Float, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from datetime import datetime
from app.core.database import Base

class Reading(Base):
    __tablename__ = "readings"

    id = Column(Integer, primary_key=True, index=True)
    ph = Column(Float, nullable=True)
    temperature = Column(Float, nullable=True)
    turbidity = Column(Float, nullable=True)
    tds = Column(Float, nullable=True)
    timestamp = Column(DateTime, default=datetime.utcnow)

    device_id = Column(Integer, ForeignKey("devices.id"), nullable=False)
    device = relationship("Device", back_populates="readings")