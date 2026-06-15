import requests
import random
import time
from datetime import datetime

STREAM_URL    = "http://127.0.0.1:8000/api/v1/iot/stream"
SAVE_URL      = "http://127.0.0.1:8000/api/v1/iot/data"
DEVICE_KEY    = "aquahome_device_secret_2026"
DEVICE_ID     = 4
INTERVAL_SECS = 10    
SAVE_INTERVAL = 1800  

RANGOS = {
    "ph":          (6.3, 9.2),    # tolerancia ±0.2
    "temperature": (0.0, 31.0),   # tolerancia +1°C
    "turbidity":   (0.0, 3.0),    # tolerancia +1 NTU
    "tds":         (0.0, 550.0),  # tolerancia +50 ppm
}

last_save_time = 0

def get_sensor_data() -> dict:
    return {
        "device_id":   DEVICE_ID,
        "ph":          round(random.uniform(6.8, 7.8), 2),   # normal
        "temperature": round(random.uniform(31.0, 32.46), 2), # algo alta, genera alerta
        "turbidity":   round(random.uniform(3.5, 6.0), 2),   # alta, genera alerta
        "tds":         round(random.uniform(150.0, 400.0), 2), # normal
    }

def tiene_alerta(data: dict) -> bool:
    for param, (min_val, max_val) in RANGOS.items():
        valor = data.get(param)
        if valor is not None and not (min_val <= valor <= max_val):
            return True
    return False


def stream_data(data: dict):
    try:
        requests.post(
            STREAM_URL,
            json=data,
            headers={
                "Content-Type": "application/json",
                "x-device-key": DEVICE_KEY,
            },
            timeout=5,
        )
        print(f"[{datetime.now().strftime('%H:%M:%S')}] Stream → {data}")
    except requests.exceptions.RequestException as e:
        print(f"[{datetime.now().strftime('%H:%M:%S')}] Error stream: {e}")

# ── Guardado en BD ─────────────────────────────────────────────────
def send_data(data: dict):
    try:
        response = requests.post(
            SAVE_URL,
            json=data,
            headers={
                "Content-Type": "application/json",
                "x-device-key": DEVICE_KEY,
            },
            timeout=5,
        )
        print(f"[{datetime.now().strftime('%H:%M:%S')}] Guardado → {response.status_code} | {data}")
    except requests.exceptions.RequestException as e:
        print(f"[{datetime.now().strftime('%H:%M:%S')}] Error guardado: {e}")

# ── Loop principal ─────────────────────────────────────────────────
if __name__ == "__main__":
    print("Iniciando — stream cada 10s, guardando cada 30min o cuando hay alerta...")
    while True:
        now  = time.time()
        data = get_sensor_data()

        # siempre hace stream en tiempo real
        stream_data(data)

        # solo guarda en BD cada 30 min o si hay alerta
        hay_alerta           = tiene_alerta(data)
        tiempo_para_guardar  = (now - last_save_time) >= SAVE_INTERVAL

        if hay_alerta or tiempo_para_guardar:
            motivo = "ALERTA" if hay_alerta else "30min"
            print(f"[{datetime.now().strftime('%H:%M:%S')}] Guardando ({motivo})")
            send_data(data)
            last_save_time = now
        else:
            mins_restantes = int((SAVE_INTERVAL - (now - last_save_time)) / 60)
            print(f"[{datetime.now().strftime('%H:%M:%S')}] Próximo guardado en {mins_restantes} min")

        time.sleep(INTERVAL_SECS)