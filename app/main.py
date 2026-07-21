from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from slowapi import Limiter, _rate_limit_exceeded_handler
from slowapi.util import get_remote_address
from slowapi.errors import RateLimitExceeded
from contextlib import asynccontextmanager
import asyncio
from fastapi import WebSocket
from app.core.database import Base, engine, SessionLocal
from app.models import user, device, reading
from app.models.device import Device
from app.api.v1.routers import auth, users, devices, readings, iot, ws, alerts, maintenance
from app.core.websocket_manager import manager
from datetime import datetime
import os
from app.core.config import settings
from sqladmin import Admin
from app.core.admin_auth import AdminAuth
from app.core.admin import UserAdmin, DeviceAdmin, ReadingAdmin, AlertAdmin, MaintenanceAdmin

async def check_timeouts():
    while True:
        await asyncio.sleep(30)
        db = SessionLocal()
        try:
            activos = db.query(Device).filter(Device.is_active == True).all()
            for dev in activos:
                last = dev.last_seen or dev.created_at
                diff = (datetime.utcnow() - last).total_seconds()
                if diff > 90:
                    dev.is_active = False
                    db.commit()
                    print(f"Dispositivo {dev.id} marcado como inactivo (diff={diff:.0f}s)")
                    await manager.broadcast_device(dev.id, {
                        "event":     "status",
                        "device_id": dev.id,
                        "is_active": False,
                    })
        except Exception as e:
            print(f"Error en check_timeouts: {e}")
        finally:
            db.close()

@asynccontextmanager
async def lifespan(app: FastAPI):
    asyncio.create_task(check_timeouts())
    yield

Base.metadata.create_all(bind=engine)
limiter = Limiter(key_func=get_remote_address)

app = FastAPI(
    title="AquaHome API",
    description="Monitoreo de calidad del agua mediante IoT",
    version="1.0.0",
    lifespan=lifespan,
)

app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,
    allow_methods=["GET", "POST", "PUT", "DELETE", "PATCH"],
    allow_headers=["*"],
)

@app.middleware("http")
async def add_security_headers(request: Request, call_next):
    response = await call_next(request)
    response.headers["X-Content-Type-Options"] = "nosniff"
    response.headers["X-Frame-Options"] = "DENY"
    response.headers["X-XSS-Protection"] = "1; mode=block"
    response.headers["Strict-Transport-Security"] = "max-age=31536000; includeSubDomains"
    return response

# --- Panel de administración ---
authentication_backend = AdminAuth(secret_key=settings.ADMIN_SECRET_KEY)
admin = Admin(app, engine, authentication_backend=authentication_backend)

admin.add_view(UserAdmin)
admin.add_view(DeviceAdmin)
admin.add_view(ReadingAdmin)
admin.add_view(AlertAdmin)
admin.add_view(MaintenanceAdmin)

app.include_router(auth.router,        prefix="/api/v1/auth",        tags=["Auth"])
app.include_router(users.router,       prefix="/api/v1/users",       tags=["Users"])
app.include_router(devices.router,     prefix="/api/v1/devices",     tags=["Devices"])
app.include_router(readings.router,    prefix="/api/v1/readings",    tags=["Readings"])
app.include_router(iot.router,         prefix="/api/v1/iot",         tags=["IoT"])
app.include_router(alerts.router,      prefix="/api/v1/alerts",      tags=["Alerts"])
app.include_router(maintenance.router, prefix="/api/v1/maintenance", tags=["Maintenance"])
app.include_router(ws.router)

@app.websocket("/ws/test")
async def test_ws(websocket: WebSocket):
    await websocket.accept()
    await websocket.send_text("ok")
    await websocket.close()

@app.get("/")
def root():
    return {"message": "AquaHome API corriendo"}