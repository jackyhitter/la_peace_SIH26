from app.api.routes.auth import router as auth_router
from app.api.routes.cameras import router as cameras_router
from app.api.routes.plates import router as plates_router
from app.api.routes.alerts import router as alerts_router
from app.api.routes.analytics import router as analytics_router
from app.api.routes.blacklist import router as blacklist_router
from app.api.routes.rto import router as rto_router

__all__ = [
    "auth_router",
    "cameras_router",
    "plates_router",
    "alerts_router",
    "analytics_router",
    "blacklist_router",
    "rto_router",
]
