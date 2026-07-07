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
  const [config, setConfigState] = useState(defaultConfig);
  const [savedConfig, setSavedConfig] = useState(defaultConfig);
  const [past, setPast] = useState([]);
  const [future, setFuture] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const load = useCallback(async () => {
    try {
      const res = await axios.get(`${API}/config`);
      const merged = deepMerge(defaultConfig, res.data.config || {});
      setConfigState(merged);
      setSavedConfig(merged);
      setPast([]);
      setFuture([]);
    } catch (e) {
      console.error("Failed to load config", e);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  const commit = (next) => {
    setPast((p) => [...p.slice(-49), config]);
    setFuture([]);
    setConfigState(next);
  };

  const updateSection = (section, patch) => commit({ ...config, [section]: { ...config[section], ...patch } });
  const setSection = (section, value) => commit({ ...config, [section]: value });
  const updatePath = (section, sub, patch) =>
    commit({ ...config, [section]: { ...config[section], [sub]: { ...config[section][sub], ...patch } } });

  const undo = () => {
    if (!past.length) return;
    const prev = past[past.length - 1];
    setPast((p) => p.slice(0, -1));
    setFuture((f) => [config, ...f]);
    setConfigState(prev);
  };
  const redo = () => {
    if (!future.length) return;
    const next = future[0];
    setFuture((f) => f.slice(1));
    setPast((p) => [...p, config]);
    setConfigState(next);
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
      setConfigState(merged);
      setSavedConfig(merged);
      setPast([]);
      setFuture([]);
      return true;
    } finally {
      setSaving(false);
    }
  };

  const discard = () => { setConfigState(savedConfig); setPast([]); setFuture([]); };
  const dirty = JSON.stringify(config) !== JSON.stringify(savedConfig);

  return (
    <ConfigContext.Provider
      value={{
        config, savedConfig, loading, saving, dirty,
        updateSection, setSection, updatePath,
        undo, redo, canUndo: past.length > 0, canRedo: future.length > 0,
        save, reset, discard, reload: load,
      }}
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
