"use client";

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { getServiceById, type DetailingService } from "@/data/services";

interface CarePlanContextValue {
  itemIds: string[];
  services: DetailingService[];
  count: number;
  totalFrom: number;
  drawerOpen: boolean;
  setDrawerOpen: (open: boolean) => void;
  isInPlan: (id: string) => boolean;
  addItem: (id: string) => void;
  removeItem: (id: string) => void;
  toggleItem: (id: string) => void;
  addMany: (ids: string[]) => void;
  clearPlan: () => void;
}

const STORAGE_KEY = "tochka_deteylinga_care_plan_v1";

const CarePlanContext = createContext<CarePlanContextValue | null>(null);

export function CarePlanProvider({ children }: { children: React.ReactNode }) {
  const [itemIds, setItemIds] = useState<string[]>([]);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const saved = window.localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          const valid = parsed.filter(
            (id): id is string =>
              typeof id === "string" && Boolean(getServiceById(id))
          );
          setItemIds(Array.from(new Set(valid)));
        }
      }
    } catch {
      // Ignore storage access errors in restricted modes
    } finally {
      setHydrated(true);
    }
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(itemIds));
    } catch {
      // Ignore storage write errors
    }
  }, [itemIds, hydrated]);

  const isInPlan = useCallback(
    (id: string) => itemIds.includes(id),
    [itemIds]
  );

  const addItem = useCallback((id: string) => {
    if (!getServiceById(id)) return;
    setItemIds((prev) => (prev.includes(id) ? prev : [...prev, id]));
  }, []);

  const removeItem = useCallback((id: string) => {
    setItemIds((prev) => prev.filter((item) => item !== id));
  }, []);

  const toggleItem = useCallback((id: string) => {
    if (!getServiceById(id)) return;
    setItemIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  }, []);

  const addMany = useCallback((ids: string[]) => {
    const valid = ids.filter((id) => Boolean(getServiceById(id)));
    if (valid.length === 0) return;
    setItemIds((prev) => Array.from(new Set([...prev, ...valid])));
  }, []);

  const clearPlan = useCallback(() => {
    setItemIds([]);
  }, []);

  const services = useMemo(
    () =>
      itemIds
        .map((id) => getServiceById(id))
        .filter((item): item is DetailingService => Boolean(item)),
    [itemIds]
  );

  const totalFrom = useMemo(
    () => services.reduce((sum, s) => sum + (s.priceFrom ?? 0), 0),
    [services]
  );

  const value = useMemo<CarePlanContextValue>(
    () => ({
      itemIds,
      services,
      count: services.length,
      totalFrom,
      drawerOpen,
      setDrawerOpen,
      isInPlan,
      addItem,
      removeItem,
      toggleItem,
      addMany,
      clearPlan,
    }),
    [
      itemIds,
      services,
      totalFrom,
      drawerOpen,
      isInPlan,
      addItem,
      removeItem,
      toggleItem,
      addMany,
      clearPlan,
    ]
  );

  return (
    <CarePlanContext.Provider value={value}>{children}</CarePlanContext.Provider>
  );
}

export function useCarePlan(): CarePlanContextValue {
  const ctx = useContext(CarePlanContext);
  if (!ctx) {
    throw new Error("useCarePlan must be used within a CarePlanProvider");
  }
  return ctx;
}
