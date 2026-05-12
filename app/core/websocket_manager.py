from fastapi import WebSocket
from typing import Dict

class WebSocketManager:
    def __init__(self):
        self.connections: Dict[int, list[WebSocket]] = {}

    async def connect(self, device_id: int, websocket: WebSocket):
        await websocket.accept()
        if device_id not in self.connections:
            self.connections[device_id] = []
        self.connections[device_id].append(websocket)

    async def connect_raw(self, device_id: int, websocket: WebSocket):
        # ya fue aceptado antes, solo registra
        if device_id not in self.connections:
            self.connections[device_id] = []
        self.connections[device_id].append(websocket)

    def disconnect(self, device_id: int, websocket: WebSocket):
        if device_id in self.connections:
            self.connections[device_id].remove(websocket)

    async def broadcast_device(self, device_id: int, message: dict):
        if device_id not in self.connections:
            return
        dead = []
        for ws in self.connections[device_id]:
            try:
                await ws.send_json(message)
            except Exception:
                dead.append(ws)
        for ws in dead:
            self.connections[device_id].remove(ws)

manager = WebSocketManager()