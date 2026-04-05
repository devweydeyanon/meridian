'use client';

import { useState, useEffect, useCallback } from 'react';

export function useFormAutosave<T extends Record<string, any>>(
  key: string,
  initialState: T,
  debounceMs = 500
): [T, (field: string, value: any) => void, () => void] {
  const [form, setForm] = useState<T>(initialState);
  const [loaded, setLoaded] = useState(false);

  // Load saved data on mount
  useEffect(() => {
    try {
      const saved = sessionStorage.getItem(`meridian_form_${key}`);
      if (saved) {
        const parsed = JSON.parse(saved);
        setForm(prev => ({ ...prev, ...parsed }));
      }
    } catch {
      // sessionStorage unavailable
    }
    setLoaded(true);
  }, [key]);

  // Save on change (debounced)
  useEffect(() => {
    if (!loaded) return;

    const timer = setTimeout(() => {
      try {
        sessionStorage.setItem(`meridian_form_${key}`, JSON.stringify(form));
      } catch {
        // storage full or unavailable
      }
    }, debounceMs);

    return () => clearTimeout(timer);
  }, [form, key, debounceMs, loaded]);

  const update = useCallback((field: string, value: any) => {
    setForm(prev => ({ ...prev, [field]: value }));
  }, []);

  const clear = useCallback(() => {
    try {
      sessionStorage.removeItem(`meridian_form_${key}`);
    } catch {
      // ignore
    }
    setForm(initialState);
  }, [key, initialState]);

  return [form, update, clear];
}
