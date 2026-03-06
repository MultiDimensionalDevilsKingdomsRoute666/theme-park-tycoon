import { useGameStore } from "./gameStore";

export const useMoney = () => useGameStore((s) => s.money);
export const useDay = () => useGameStore((s) => s.day);
export const useTimeOfDay = () => useGameStore((s) => s.timeOfDay);
export const useSpeed = () => useGameStore((s) => s.speed);
export const usePaused = () => useGameStore((s) => s.paused);
export const useParkRating = () => useGameStore((s) => s.parkRating);
export const useTotalGuests = () => useGameStore((s) => s.totalGuests);
export const useHappiness = () => useGameStore((s) => s.happiness);
export const useCleanliness = () => useGameStore((s) => s.cleanliness);
export const useToolMode = () => useGameStore((s) => s.toolMode);
export const useSelectedRideType = () => useGameStore((s) => s.selectedRideType);
export const useSelectedSceneryType = () => useGameStore((s) => s.selectedSceneryType);
export const useSelectedEntityId = () => useGameStore((s) => s.selectedEntityId);
export const useHoveredTile = () => useGameStore((s) => s.hoveredTile);
export const useToasts = () => useGameStore((s) => s.toasts);
