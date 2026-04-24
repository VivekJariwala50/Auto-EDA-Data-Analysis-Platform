import { create } from "zustand";
import type { CsvDataset } from "../features/csv/csvTypes";

interface CsvState {
  dataset: CsvDataset | null;
  setDataset: (data: CsvDataset) => void;
  clearDataset: () => void;
}

export const useCsvStore = create<CsvState>((set) => ({
  dataset: null,
  setDataset: (data) => set({ dataset: data }),
  clearDataset: () => set({ dataset: null }),
}));
