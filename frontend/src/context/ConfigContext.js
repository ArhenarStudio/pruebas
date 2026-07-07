import React, { createContext, useContext, useEffect, useState, useCallback } from "react";
import axios from "axios";
import { defaultConfig } from "@/lib/siteData";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const ConfigContext = createContext(null);

const deepMerge = (base, override) => {
  if (Array.isArray(override)) return override;
  if (typeof base !== "object" || base === null) return override;
  const out = { ...base };
  for (const key of Object.keys(override || {})) {
    if (typeof override[key] === "object" && !Array.isArray(override[key]) && override[key] !== null) {
      out[key] = deepMerge(base[key] || {}, override[key]);
    } else {
      out[key] = override[key];
    }
  }
  return out;
};

export const ConfigProvider = ({ children }) => {
  const [config, setConfig] = useState(defaultConfig);
  const [savedConfig, setSavedConfig] = useState(defaultConfig);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const load = useCallback(async () => {
    try {
      const res = await axios.get(`${API}/config`);
      const merged = deepMerge(defaultConfig, res.data.config || {});
      setConfig(merged);
      setSavedConfig(merged);
    } catch (e) {
      console.error("Failed to load config", e);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const updateSection = (section, patch) => {
    setConfig((prev) => ({ ...prev, [section]: { ...prev[section], ...patch } }));
  };

  const setSection = (section, value) => {
    setConfig((prev) => ({ ...prev, [section]: value }));
  };

  const save = async () => {
    setSaving(true);
    try {
      const res = await axios.put(`${API}/config`, { config });
      const merged = deepMerge(defaultConfig, res.data.config || {});
      setSavedConfig(merged);
      return true;
    } catch (e) {
      console.error("Save failed", e);
      return false;
    } finally {
      setSaving(false);
    }
  };

  const reset = async () => {
    setSaving(true);
    try {
      const res = await axios.post(`${API}/config/reset`);
      const merged = deepMerge(defaultConfig, res.data.config || {});
      setConfig(merged);
      setSavedConfig(merged);
      return true;
    } finally {
      setSaving(false);
    }
  };

  const discard = () => setConfig(savedConfig);

  const dirty = JSON.stringify(config) !== JSON.stringify(savedConfig);

  return (
    <ConfigContext.Provider
      value={{ config, savedConfig, loading, saving, dirty, updateSection, setSection, save, reset, discard, reload: load }}
    >
      {children}
    </ConfigContext.Provider>
  );
};

export const useConfig = () => {
  const ctx = useContext(ConfigContext);
  if (!ctx) throw new Error("useConfig must be used within ConfigProvider");
  return ctx;
};
