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
    "announcementBar": {
        "enabled": True,
        "text": "Free worldwide shipping on orders over $150 — Ends Sunday.",
        "bgColor": "#0A0A0A",
        "textColor": "#FFFFFF",
        "linkLabel": "Shop the sale",
        "link": "#",
        "dismissible": True,
    },
    "header": {
        "logoText": "MERIDIAN",
        "logoImage": "",
        "navLinks": [
            {"label": "New In", "href": "#"},
            {"label": "Furniture", "href": "#"},
            {"label": "Lighting", "href": "#"},
            {"label": "Journal", "href": "#"},
        ],
        "layout": "logo-left",
        "bgColor": "#FFFFFF",
        "textColor": "#0A0A0A",
        "showSearch": True,
        "showCart": True,
        "ctaLabel": "",
    },
    "stickyHeader": {
        "enabled": True,
        "style": "pill",
        "showAfter": 240,
        "bgColor": "#FFFFFF",
        "textColor": "#0A0A0A",
        "blur": True,
        "pillLabel": "MERIDIAN",
        "pillCtaLabel": "Cart",
    },
    "footer": {
        "brandName": "MERIDIAN",
        "tagline": "Considered objects for the modern interior.",
        "bgColor": "#0A0A0A",
        "textColor": "#FFFFFF",
        "columns": [
            {"title": "Shop", "links": [{"label": "New Arrivals", "href": "#"}, {"label": "Best Sellers", "href": "#"}, {"label": "Sale", "href": "#"}]},
            {"title": "Company", "links": [{"label": "About", "href": "#"}, {"label": "Careers", "href": "#"}, {"label": "Stores", "href": "#"}]},
            {"title": "Support", "links": [{"label": "Contact", "href": "#"}, {"label": "Shipping", "href": "#"}, {"label": "Returns", "href": "#"}]},
        ],
        "socials": [
            {"platform": "instagram", "href": "#"},
            {"platform": "twitter", "href": "#"},
            {"platform": "facebook", "href": "#"},
        ],
        "copyright": "© 2026 Meridian Studio. All rights reserved.",
    },
    "cart": {
        "title": "Your Cart",
        "emptyText": "Your cart is currently empty.",
        "checkoutLabel": "Proceed to Checkout",
        "accentColor": "#002FA7",
        "showImages": True,
        "freeShippingThreshold": 150,
    },
}


class ConfigUpdate(BaseModel):
    config: Dict[str, Any] = Field(default_factory=dict)


@api_router.get("/")
async def root():
    return {"message": "CMS Site Builder API"}


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
