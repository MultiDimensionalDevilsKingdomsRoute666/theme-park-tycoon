"use client";

import { useMoney, useDay, useParkRating, useTotalGuests, useHappiness, useCleanliness, useSpeed, usePaused } from "@/store/selectors";
import { useGameStore } from "@/store/gameStore";

export default function TopBar() {
  const money = useMoney();
  const day = useDay();
  const parkRating = useParkRating();
  const totalGuests = useTotalGuests();
  const happiness = useHappiness();
  const cleanliness = useCleanliness();
  const speed = useSpeed();
  const paused = usePaused();

  const setSpeed = useGameStore((s) => s.setSpeed);
  const togglePaused = useGameStore((s) => s.togglePaused);

  return (
    <div className="absolute top-0 left-0 right-0 flex items-center justify-between bg-gray-900/90 text-white px-4 py-2 text-sm z-10 backdrop-blur-sm">
      <div className="flex items-center gap-4">
        <span className="font-bold text-green-400">${money.toLocaleString()}</span>
        <span>Day {day}</span>
        <span className="text-yellow-400">Rating: {parkRating}</span>
      </div>
      <div className="flex items-center gap-4">
        <span>Guests: {totalGuests}</span>
        <span className={happiness > 60 ? "text-green-400" : happiness > 30 ? "text-yellow-400" : "text-red-400"}>
          Happy: {Math.round(happiness)}%
        </span>
        <span className={cleanliness > 60 ? "text-green-400" : cleanliness > 30 ? "text-yellow-400" : "text-red-400"}>
          Clean: {Math.round(cleanliness)}%
        </span>
      </div>
      <div className="flex items-center gap-2">
        <button
          onClick={togglePaused}
          className={`px-2 py-1 rounded text-xs ${paused ? "bg-red-600" : "bg-gray-700"} hover:bg-gray-600`}
        >
          {paused ? "PAUSED" : "II"}
        </button>
        {[1, 2, 3].map((s) => (
          <button
            key={s}
            onClick={() => setSpeed(s)}
            className={`px-2 py-1 rounded text-xs ${speed === s && !paused ? "bg-blue-600" : "bg-gray-700"} hover:bg-gray-600`}
          >
            {s}x
          </button>
        ))}
      </div>
    </div>
  );
}
