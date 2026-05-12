from fastapi import APIRouter, WebSocket, WebSocketDisconnect
from app.core.websocket_manager import manager
from app.core.security import decode_token
from app.core.database import SessionLocal
from app.models.user import User
from app.models.device import Device
from jose import JWTError

router = APIRouter()

@router.websocket("/ws/device/{device_id}")
async def device_websocket(device_id: int, websocket: WebSocket):
    await websocket.accept()

    # ── Paso 1: esperar token en el primer mensaje ──
    try:
        first = await websocket.receive_json()
        token = first.get("token")
        if not token:
            await websocket.close(code=1008)
            return
    except Exception:
        await websocket.close(code=1008)
        return

    # ── Paso 2: validar token ──
    db = SessionLocal()
    try:
        payload = decode_token(token)
        user_id = int(payload.get("sub"))
        user = db.query(User).filter(User.id == user_id, User.is_active == True).first()
        if not user:
            await websocket.close(code=1008)
            return
    except (JWTError, ValueError, AttributeError):
        await websocket.close(code=1008)
        return
    finally:
        db.close()

    # ── Paso 3: verificar que el dispositivo pertenece al usuario ──
    db = SessionLocal()
    try:
        device = db.query(Device).filter(
            Device.id == device_id,
            Device.owner_id == user.id
        ).first()
        if not device:
            await websocket.close(code=1008)
            return
    finally:
        db.close()

    # ── Paso 4: registrar conexión y enviar estado actual ──
    await manager.connect_raw(device_id, websocket)

    db = SessionLocal()
    try:
        dev = db.query(Device).filter(Device.id == device_id).first()
        await websocket.send_json({
            "event":     "authenticated",
            "is_active": dev.is_active if dev else False,
        })
    finally:
        db.close()

    # ── Paso 5: mantener conexión viva ──
    try:
        while True:
            await websocket.receive_text()
    except WebSocketDisconnect:
        manager.disconnect(device_id, websocket)

    