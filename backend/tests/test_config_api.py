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

    def test_put_config_persists(self, client):
        # Get current
        r = client.get(f"{API}/config", timeout=15)
        cfg = copy.deepcopy(r.json()["config"])
        cfg["announcementBar"]["text"] = "TEST_announcement_updated"
        cfg["header"]["logoText"] = "TEST_BRAND"

        r2 = client.put(f"{API}/config", json={"config": cfg}, timeout=15)
        assert r2.status_code == 200
        updated = r2.json()["config"]
        assert updated["announcementBar"]["text"] == "TEST_announcement_updated"
        assert updated["header"]["logoText"] == "TEST_BRAND"

        # GET to verify persistence
        r3 = client.get(f"{API}/config", timeout=15)
        assert r3.status_code == 200
        got = r3.json()["config"]
        assert got["announcementBar"]["text"] == "TEST_announcement_updated"
        assert got["header"]["logoText"] == "TEST_BRAND"

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
