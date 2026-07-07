"""Backend API tests for CMS config endpoints."""
import os
import copy
import requests
import pytest

BASE_URL = os.environ.get('REACT_APP_BACKEND_URL', 'https://page-composer-16.preview.emergentagent.com').rstrip('/')
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

    def test_get_config_returns_defaults(self, client):
        r = client.get(f"{API}/config", timeout=15)
        assert r.status_code == 200
        data = r.json()
        assert "config" in data
        cfg = data["config"]
        for key in ["announcementBar", "header", "stickyHeader", "footer", "cart"]:
            assert key in cfg
        assert cfg["header"]["logoText"] == "MERIDIAN"
        assert cfg["announcementBar"]["enabled"] is True

    def test_defaults_include_new_schema(self, client):
        r = client.get(f"{API}/config", timeout=15)
        cfg = r.json()["config"]
        ann = cfg["announcementBar"]
        assert "announcements" in ann and isinstance(ann["announcements"], list) and len(ann["announcements"]) == 2
        assert "transition" in ann
        assert "background" in ann and ann["background"]["type"] in ["solid", "gradient", "pattern"]
        assert "linkStyle" in cfg["header"]
        for k in ["animation", "border", "hoverColor", "showIcon"]:
            assert k in cfg["header"]["linkStyle"]
        assert "background" in cfg["header"]

    def test_put_config_persists(self, client):
        r = client.get(f"{API}/config", timeout=15)
        cfg = copy.deepcopy(r.json()["config"])
        cfg["announcementBar"]["announcements"] = [
            {"text": "TEST_ann_1", "linkLabel": "L1", "link": "#1"},
            {"text": "TEST_ann_2", "linkLabel": "L2", "link": "#2"},
            {"text": "TEST_ann_3", "linkLabel": "L3", "link": "#3"},
        ]
        cfg["announcementBar"]["transition"] = "marquee"
        cfg["announcementBar"]["background"] = {
            "type": "gradient",
            "color": "#000000",
            "gradient": {"from": "#FF0000", "to": "#00FF00", "angle": 45},
            "pattern": {"id": "dots", "patternColor": "#FFFFFF", "opacity": 0.2, "size": 24, "emoji": "★"},
        }
        cfg["header"]["logoText"] = "TEST_BRAND"
        cfg["header"]["linkStyle"] = {"animation": "scale", "border": "pill", "hoverColor": "#FF00FF", "showIcon": True}

        r2 = client.put(f"{API}/config", json={"config": cfg}, timeout=15)
        assert r2.status_code == 200
        updated = r2.json()["config"]
        assert len(updated["announcementBar"]["announcements"]) == 3
        assert updated["announcementBar"]["transition"] == "marquee"
        assert updated["announcementBar"]["background"]["type"] == "gradient"
        assert updated["header"]["logoText"] == "TEST_BRAND"
        assert updated["header"]["linkStyle"]["animation"] == "scale"

        # GET to verify persistence
        r3 = client.get(f"{API}/config", timeout=15)
        assert r3.status_code == 200
        got = r3.json()["config"]
        assert got["announcementBar"]["announcements"][0]["text"] == "TEST_ann_1"
        assert got["header"]["linkStyle"]["showIcon"] is True

    def test_reset_config(self, client):
        r = client.post(f"{API}/config/reset", timeout=15)
        assert r.status_code == 200
        cfg = r.json()["config"]
        assert cfg["header"]["logoText"] == "MERIDIAN"
        # verify persisted
        r2 = client.get(f"{API}/config", timeout=15)
        assert r2.json()["config"]["header"]["logoText"] == "MERIDIAN"

    def test_no_mongo_object_id_in_response(self, client):
        r = client.get(f"{API}/config", timeout=15)
        assert "_id" not in r.json()
