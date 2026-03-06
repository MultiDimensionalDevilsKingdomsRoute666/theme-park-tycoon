import { create } from "zustand";
import { INITIAL_MONEY } from "@/engine/constants";
import { ToolMode } from "@/engine/types";
import type { GameState, RideType, SceneryType, TileCoord, Toast } from "@/engine/types";

interface GameStore extends GameState {
  setMoney: (money: number) => void;
  addMoney: (amount: number) => void;
  setDay: (day: number) => void;
  setTimeOfDay: (time: number) => void;
  setSpeed: (speed: number) => void;
  setPaused: (paused: boolean) => void;
  togglePaused: () => void;
  setParkRating: (rating: number) => void;
  setTotalGuests: (count: number) => void;
  setHappiness: (happiness: number) => void;
  setCleanliness: (cleanliness: number) => void;
  setToolMode: (mode: ToolMode) => void;
  setSelectedRideType: (type: RideType | null) => void;
  setSelectedSceneryType: (type: SceneryType | null) => void;
  setSelectedEntityId: (id: string | null) => void;
  setHoveredTile: (tile: TileCoord | null) => void;
  addToast: (toast: Toast) => void;
  removeToast: (id: string) => void;
}

export const useGameStore = create<GameStore>((set) => ({
  money: INITIAL_MONEY,
  day: 1,
  timeOfDay: 0,
  speed: 1,
  paused: false,
  parkRating: 0,
  totalGuests: 0,
  happiness: 50,
  cleanliness: 100,
  toolMode: ToolMode.SELECT,
  selectedRideType: null,
  selectedSceneryType: null,
  selectedEntityId: null,
  hoveredTile: null,
  toasts: [],

  setMoney: (money) => set({ money }),
  addMoney: (amount) => set((s) => ({ money: s.money + amount })),
  setDay: (day) => set({ day }),
  setTimeOfDay: (time) => set({ timeOfDay: time }),
  setSpeed: (speed) => set({ speed }),
  setPaused: (paused) => set({ paused }),
  togglePaused: () => set((s) => ({ paused: !s.paused })),
  setParkRating: (rating) => set({ parkRating: rating }),
  setTotalGuests: (count) => set({ totalGuests: count }),
  setHappiness: (happiness) => set({ happiness }),
  setCleanliness: (cleanliness) => set({ cleanliness }),
  setToolMode: (mode) =>
    set({
      toolMode: mode,
      selectedRideType: null,
      selectedSceneryType: null,
      selectedEntityId: null,
    }),
  setSelectedRideType: (type) =>
    set({ selectedRideType: type, toolMode: ToolMode.RIDE }),
  setSelectedSceneryType: (type) =>
    set({ selectedSceneryType: type, toolMode: ToolMode.SCENERY }),
  setSelectedEntityId: (id) => set({ selectedEntityId: id }),
  setHoveredTile: (tile) => set({ hoveredTile: tile }),
  addToast: (toast) => set((s) => ({ toasts: [...s.toasts, toast] })),
  removeToast: (id) =>
    set((s) => ({ toasts: s.toasts.filter((t) => t.id !== id) })),
}));
