from sqladmin.authentication import AuthenticationBackend
from starlette.requests import Request
from app.core.config import settings


class AdminAuth(AuthenticationBackend):
    async def login(self, request: Request) -> bool:
        form = await request.form()
        usuario, password = form["username"], form["password"]

        if usuario == settings.ADMIN_USER and password == settings.ADMIN_PASSWORD:
            request.session.update({"token": "admin-autenticado"})
            return True
        return False

    async def logout(self, request: Request) -> bool:
        request.session.clear()
        return True

    async def authenticate(self, request: Request) -> bool:
        return request.session.get("token") is not None