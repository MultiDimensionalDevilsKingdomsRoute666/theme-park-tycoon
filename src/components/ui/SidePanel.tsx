"use client";

import { useSelectedEntityId } from "@/store/selectors";
import { useGameStore } from "@/store/gameStore";
import type { RideInstance, SceneryInstance } from "@/engine/types";
import { RIDE_DEFINITIONS } from "@/data/rides";
import { SCENERY_DEFINITIONS } from "@/data/scenery";

interface SidePanelProps {
  rides: RideInstance[];
  scenery: SceneryInstance[];
}

export default function SidePanel({ rides, scenery }: SidePanelProps) {
  const selectedEntityId = useSelectedEntityId();
  const setSelectedEntityId = useGameStore((s) => s.setSelectedEntityId);

  if (!selectedEntityId) return null;

  const ride = rides.find((r) => r.id === selectedEntityId);
  const sceneryItem = scenery.find((s) => s.id === selectedEntityId);

  if (!ride && !sceneryItem) return null;

  return (
    <div className="absolute top-12 right-4 w-56 bg-gray-900/90 text-white rounded-lg p-4 z-10 backdrop-blur-sm text-sm">
      <button
        onClick={() => setSelectedEntityId(null)}
        className="absolute top-2 right-2 text-gray-400 hover:text-white text-xs"
      >
        X
      </button>

      {ride && (
        <>
          <h3 className="font-bold mb-2" style={{ color: RIDE_DEFINITIONS[ride.type].color }}>
            {RIDE_DEFINITIONS[ride.type].name}
          </h3>
          <div className="space-y-1">
            <div className="flex justify-between">
              <span className="text-gray-400">Excitement</span>
              <span>{RIDE_DEFINITIONS[ride.type].excitement}%</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Ticket Price</span>
              <span>${RIDE_DEFINITIONS[ride.type].ticketPrice}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Queue</span>
              <span>{ride.queue.length}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Total Rides</span>
              <span>{ride.totalRides}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Revenue</span>
              <span className="text-green-400">${ride.totalRevenue}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Status</span>
              <span className={ride.isRunning ? "text-green-400" : "text-gray-400"}>
                {ride.isRunning ? "Running" : "Idle"}
              </span>
            </div>
          </div>
        </>
      )}

      {sceneryItem && (
        <>
          <h3 className="font-bold mb-2" style={{ color: SCENERY_DEFINITIONS[sceneryItem.type].color }}>
            {SCENERY_DEFINITIONS[sceneryItem.type].name}
          </h3>
          <div className="space-y-1">
            <div className="flex justify-between">
              <span className="text-gray-400">Happiness Bonus</span>
              <span>+{SCENERY_DEFINITIONS[sceneryItem.type].happinessBonus}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Position</span>
              <span>({sceneryItem.col}, {sceneryItem.row})</span>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
