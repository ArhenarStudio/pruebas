from fastapi import FastAPI, APIRouter
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
from pathlib import Path
from pydantic import BaseModel, Field
from typing import Any, Dict
from datetime import datetime, timezone


ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

app = FastAPI()
api_router = APIRouter(prefix="/api")

SITE_ID = "site"

DEFAULT_CONFIG: Dict[str, Any] = {
    "theme": {"headingFont": "Sora", "bodyFont": "Inter", "radius": 10, "accent": "#3FC16F"},
    "announcementBar": {
        "enabled": True,
        "transition": "slide",
        "interval": 4000,
        "paddingY": 9,
        "dismissible": True,
        "textColor": "#062012",
        "background": {
            "type": "solid",
            "color": "#3FC16F",
            "gradient": {"from": "#3FC16F", "to": "#0B1510", "angle": 90},
            "pattern": {"id": "none", "patternColor": "#FFFFFF", "opacity": 0.12, "size": 20, "emoji": "🎉"},
        },
        "announcements": [
            {"text": "🎉 Gran Sorteo LotoCorp — ¡Boletos desde $150 MXN!", "linkLabel": "Comprar ahora", "link": "#"},
            {"text": "🚚 Enviamos el premio a todo México sin costo", "linkLabel": "Ver bases", "link": "#"},
        ],
    },
    "header": {
        "logo": {
            "mode": "image-text", "text": "LotoCorp", "image": "", "size": 22,
            "offsetX": 0, "offsetY": 0, "position": "inside", "verified": True,
            "verifiedIcon": "check", "center": False,
        },
        "navLinks": [
            {"label": "Sorteos", "href": "#", "normalColor": "#EAF2EC", "hoverColor": "#3FC16F", "activeColor": "#3FC16F"},
            {"label": "Ganadores", "href": "#", "normalColor": "#EAF2EC", "hoverColor": "#3FC16F", "activeColor": "#3FC16F"},
            {"label": "Cómo Participar", "href": "#", "normalColor": "#EAF2EC", "hoverColor": "#3FC16F", "activeColor": "#3FC16F"},
            {"label": "Ayuda", "href": "#", "normalColor": "#EAF2EC", "hoverColor": "#3FC16F", "activeColor": "#3FC16F"},
        ],
        "actions": [
            {"type": "button", "preset": "comprar", "label": "Comprar boletos", "href": "#", "bg": "#3FC16F", "color": "#062012", "icon": "ticket"},
            {"type": "icon", "preset": "cuenta", "label": "Mi cuenta", "href": "#", "bg": "transparent", "color": "#EAF2EC", "icon": "user"},
            {"type": "icon-badge", "preset": "carrito", "label": "Carrito", "href": "#", "bg": "transparent", "color": "#EAF2EC", "icon": "cart"},
        ],
        "shell": {
            "paddingY": 16, "sticky": True, "shadow": True, "pill": False, "textColor": "#EAF2EC",
            "background": {
                "type": "solid", "color": "#0B1510",
                "gradient": {"from": "#0B1510", "to": "#122018", "angle": 90},
                "pattern": {"id": "none", "patternColor": "#3FC16F", "opacity": 0.08, "size": 24, "emoji": "✦"},
            },
        },
    },
    "sections": [
        {"id": "sorteos", "label": "Sorteos Activos", "enabled": True},
        {"id": "como", "label": "Cómo Participar", "enabled": True},
        {"id": "ganadores", "label": "Ganadores", "enabled": True},
    ],
    "footer": {
        "brandName": "LotoCorp",
        "tagline": "Sorteos transparentes y auditados. Permiso SEGOB No. 20260123.",
        "background": {"type": "solid", "color": "#081109"},
        "textColor": "#EAF2EC",
        "columns": [
            {"title": "Sorteos", "links": [{"label": "Activos", "href": "#"}, {"label": "Próximos", "href": "#"}, {"label": "Finalizados", "href": "#"}]},
            {"title": "Empresa", "links": [{"label": "Nosotros", "href": "#"}, {"label": "Transparencia", "href": "#"}, {"label": "Contacto", "href": "#"}]},
            {"title": "Ayuda", "links": [{"label": "Cómo participar", "href": "#"}, {"label": "Preguntas frecuentes", "href": "#"}, {"label": "Bases legales", "href": "#"}]},
        ],
        "socials": [{"platform": "instagram", "href": "#"}, {"platform": "facebook", "href": "#"}, {"platform": "youtube", "href": "#"}],
        "copyright": "© 2026 LotoCorp México. Todos los derechos reservados.",
    },
    "cart": {
        "title": "Tus boletos",
        "emptyText": "Aún no has agregado boletos.",
        "checkoutLabel": "Ir a pagar",
        "accentColor": "#3FC16F",
        "showImages": True,
        "freeShippingThreshold": 0,
    },
}


class ConfigUpdate(BaseModel):
    config: Dict[str, Any] = Field(default_factory=dict)


@api_router.get("/")
async def root():
    return {"message": "Sitecraft CMS API"}


@api_router.get("/config")
async def get_config():
    doc = await db.site_config.find_one({"_id": SITE_ID})
    if not doc:
        now = datetime.now(timezone.utc).isoformat()
        doc = {"_id": SITE_ID, "config": DEFAULT_CONFIG, "updatedAt": now}
        await db.site_config.insert_one(doc)
    return {"config": doc["config"], "updatedAt": doc.get("updatedAt")}


@api_router.put("/config")
async def update_config(payload: ConfigUpdate):
    now = datetime.now(timezone.utc).isoformat()
    await db.site_config.update_one(
        {"_id": SITE_ID},
        {"$set": {"config": payload.config, "updatedAt": now}},
        upsert=True,
    )
    return {"config": payload.config, "updatedAt": now}


@api_router.post("/config/reset")
async def reset_config():
    now = datetime.now(timezone.utc).isoformat()
    await db.site_config.update_one(
        {"_id": SITE_ID},
        {"$set": {"config": DEFAULT_CONFIG, "updatedAt": now}},
        upsert=True,
    )
    return {"config": DEFAULT_CONFIG, "updatedAt": now}


app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_methods=["*"],
    allow_headers=["*"],
)

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()
