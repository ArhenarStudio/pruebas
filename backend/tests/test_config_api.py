"""Backend API tests for Sorthea Studio v2 config endpoints."""
import os
import copy
import requests
import pytest

def _get_base():
    v = os.environ.get('REACT_APP_BACKEND_URL')
    if v:
        return v.rstrip('/')
    # fallback: parse frontend/.env
    p = os.path.join(os.path.dirname(__file__), '..', '..', 'frontend', '.env')
    with open(p) as f:
        for line in f:
            if line.startswith('REACT_APP_BACKEND_URL='):
                return line.split('=', 1)[1].strip().rstrip('/')
    raise RuntimeError('REACT_APP_BACKEND_URL not set')

BASE_URL = _get_base()
API = f"{BASE_URL}/api"


@pytest.fixture(scope="module")
def client():
    s = requests.Session()
    s.headers.update({"Content-Type": "application/json"})
    return s


@pytest.fixture(scope="module", autouse=True)
def reset_before_and_after(client):
    client.post(f"{API}/config/reset", timeout=15)
    yield
    client.post(f"{API}/config/reset", timeout=15)


class TestConfigAPI:
    def test_root(self, client):
        r = client.get(f"{API}/", timeout=15)
        assert r.status_code == 200
        assert "message" in r.json()

    def test_get_config_returns_v2_defaults(self, client):
        r = client.get(f"{API}/config", timeout=15)
        assert r.status_code == 200
        data = r.json()
        assert "config" in data
        cfg = data["config"]
        # v2 top-level keys
        for key in ["theme", "announcementBar", "header", "sections", "footer", "cart"]:
            assert key in cfg, f"missing top-level key {key}"
        # header v2 sub-structure
        for key in ["logo", "navLinks", "actions", "shell"]:
            assert key in cfg["header"], f"missing header.{key}"
        assert cfg["header"]["logo"]["text"] == "LotoCorp"
        assert cfg["header"]["logo"]["mode"] == "image-text"
        assert cfg["header"]["logo"]["verified"] is True
        # capacity defaults
        assert len(cfg["header"]["navLinks"]) == 4
        assert len(cfg["header"]["actions"]) == 3
        # sections default 3
        assert len(cfg["sections"]) == 3
        assert [s["id"] for s in cfg["sections"]] == ["sorteos", "como", "ganadores"]
        # announcementBar
        assert cfg["announcementBar"]["enabled"] is True
        assert len(cfg["announcementBar"]["announcements"]) == 2
        # backgrounds must expose engine schema
        for path in [cfg["announcementBar"]["background"], cfg["header"]["shell"]["background"], cfg["footer"]["background"]]:
            assert path["type"] in ("solid", "gradient", "pattern")

    def test_put_config_persists(self, client):
        r = client.get(f"{API}/config", timeout=15)
        cfg = copy.deepcopy(r.json()["config"])
        cfg["header"]["logo"]["text"] = "TEST_BRAND"
        cfg["header"]["navLinks"] = cfg["header"]["navLinks"] + [
            {"label": "TEST_extra", "href": "#", "normalColor": "#fff", "hoverColor": "#3FC16F", "activeColor": "#3FC16F"}
        ]
        cfg["header"]["shell"]["paddingY"] = 30
        cfg["announcementBar"]["announcements"] = [{"text": "TEST_msg", "linkLabel": "L", "link": "#"}]
        cfg["sections"] = [{"id": "sorteos", "label": "S", "enabled": False}, {"id": "como", "label": "C", "enabled": True}]
        cfg["footer"]["brandName"] = "TEST_FOOTER"

        r2 = client.put(f"{API}/config", json={"config": cfg}, timeout=15)
        assert r2.status_code == 200
        upd = r2.json()["config"]
        assert upd["header"]["logo"]["text"] == "TEST_BRAND"
        assert len(upd["header"]["navLinks"]) == 5
        assert upd["header"]["shell"]["paddingY"] == 30

        # GET verifies persistence
        r3 = client.get(f"{API}/config", timeout=15)
        got = r3.json()["config"]
        assert got["header"]["logo"]["text"] == "TEST_BRAND"
        assert got["announcementBar"]["announcements"][0]["text"] == "TEST_msg"
        assert got["footer"]["brandName"] == "TEST_FOOTER"
        assert got["sections"][0]["enabled"] is False

    def test_reset_restores_defaults(self, client):
        # dirty first
        r = client.get(f"{API}/config", timeout=15)
        cfg = copy.deepcopy(r.json()["config"])
        cfg["header"]["logo"]["text"] = "DIRTY"
        client.put(f"{API}/config", json={"config": cfg}, timeout=15)

        r2 = client.post(f"{API}/config/reset", timeout=15)
        assert r2.status_code == 200
        rcfg = r2.json()["config"]
        assert rcfg["header"]["logo"]["text"] == "LotoCorp"
        assert len(rcfg["header"]["navLinks"]) == 4
        assert len(rcfg["header"]["actions"]) == 3
        assert len(rcfg["sections"]) == 3

        # persisted
        r3 = client.get(f"{API}/config", timeout=15)
        assert r3.json()["config"]["header"]["logo"]["text"] == "LotoCorp"

    def test_no_mongo_object_id_in_response(self, client):
        r = client.get(f"{API}/config", timeout=15)
        j = r.json()
        assert "_id" not in j
        assert "_id" not in j.get("config", {})
