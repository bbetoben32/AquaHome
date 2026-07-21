from sqladmin import ModelView

from app.models.user import User
from app.models.device import Device
from app.models.reading import Reading
from app.models.alert import Alert
from app.models.maintenance import Maintenance


class UserAdmin(ModelView, model=User):
    column_exclude_list = [User.password]
    name = "Usuario"
    name_plural = "Usuarios"
    icon = "fa-solid fa-user"
    category = "Gestión"


class DeviceAdmin(ModelView, model=Device):
    column_list = [Device.id, Device.is_active, Device.last_seen, Device.created_at]
    column_filters = [Device.is_active]
    name = "Dispositivo"
    name_plural = "Dispositivos"
    icon = "fa-solid fa-microchip"
    category = "Gestión"


class ReadingAdmin(ModelView, model=Reading):
    column_list = "__all__"
    can_create = False
    can_edit = False
    name = "Lectura"
    name_plural = "Lecturas"
    icon = "fa-solid fa-chart-line"
    category = "Monitoreo"


class AlertAdmin(ModelView, model=Alert):
    column_list = "__all__"
    name = "Alerta"
    name_plural = "Alertas"
    icon = "fa-solid fa-triangle-exclamation"
    category = "Monitoreo"


class MaintenanceAdmin(ModelView, model=Maintenance):
    column_list = "__all__"
    name = "Mantenimiento"
    name_plural = "Mantenimientos"
    icon = "fa-solid fa-screwdriver-wrench"
    category = "Gestión"