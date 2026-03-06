"use client";

import { useGameStore } from "@/store/gameStore";
import { useToolMode, useSelectedRideType, useSelectedSceneryType } from "@/store/selectors";
import { ToolMode } from "@/engine/types";
import { RIDE_DEFINITIONS } from "@/data/rides";
import { SCENERY_DEFINITIONS } from "@/data/scenery";
import ToolButton from "./ToolButton";
import { useEffect, useState } from "react";

export default function Toolbar() {
  const toolMode = useToolMode();
  const selectedRideType = useSelectedRideType();
  const selectedSceneryType = useSelectedSceneryType();

  const setToolMode = useGameStore((s) => s.setToolMode);
  const setSelectedRideType = useGameStore((s) => s.setSelectedRideType);
  const setSelectedSceneryType = useGameStore((s) => s.setSelectedSceneryType);
  const togglePaused = useGameStore((s) => s.togglePaused);

  const [showRideMenu, setShowRideMenu] = useState(false);
  const [showSceneryMenu, setShowSceneryMenu] = useState(false);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;
      switch (e.key) {
        case "1": setToolMode(ToolMode.SELECT); break;
        case "2": setToolMode(ToolMode.PATH); break;
        case "3":
          setToolMode(ToolMode.RIDE);
          setShowRideMenu(true);
          setShowSceneryMenu(false);
          break;
        case "4":
          setToolMode(ToolMode.SCENERY);
          setShowSceneryMenu(true);
          setShowRideMenu(false);
          break;
        case "5": setToolMode(ToolMode.DEMOLISH); break;
        case " ":
          e.preventDefault();
          togglePaused();
          break;
      }
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [setToolMode, togglePaused]);

  return (
    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-10">
      <div className="flex items-end gap-2 bg-gray-900/90 rounded-lg p-2 backdrop-blur-sm">
        <ToolButton
          label="Select"
          icon="👆"
          active={toolMode === ToolMode.SELECT}
          onClick={() => { setToolMode(ToolMode.SELECT); setShowRideMenu(false); setShowSceneryMenu(false); }}
          shortcut="1"
        />
        <ToolButton
          label="Path"
          icon="🛤️"
          active={toolMode === ToolMode.PATH}
          onClick={() => { setToolMode(ToolMode.PATH); setShowRideMenu(false); setShowSceneryMenu(false); }}
          shortcut="2"
        />
        <div className="relative">
          <ToolButton
            label="Rides"
            icon="🎢"
            active={toolMode === ToolMode.RIDE}
            onClick={() => {
              setToolMode(ToolMode.RIDE);
              setShowRideMenu(!showRideMenu);
              setShowSceneryMenu(false);
            }}
            shortcut="3"
          />
          {showRideMenu && (
            <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 bg-gray-900/95 rounded-lg p-2 backdrop-blur-sm min-w-[160px]">
              {Object.values(RIDE_DEFINITIONS).map((def) => (
                <button
                  key={def.type}
                  onClick={() => {
                    setSelectedRideType(def.type);
                    setShowRideMenu(false);
                  }}
                  className={`w-full text-left px-3 py-1.5 rounded text-xs text-white hover:bg-gray-700 flex justify-between ${
                    selectedRideType === def.type ? "bg-blue-600" : ""
                  }`}
                >
                  <span>{def.name}</span>
                  <span className="text-green-400">${def.cost}</span>
                </button>
              ))}
            </div>
          )}
        </div>
        <div className="relative">
          <ToolButton
            label="Scenery"
            icon="🌳"
            active={toolMode === ToolMode.SCENERY}
            onClick={() => {
              setToolMode(ToolMode.SCENERY);
              setShowSceneryMenu(!showSceneryMenu);
              setShowRideMenu(false);
            }}
            shortcut="4"
          />
          {showSceneryMenu && (
            <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 bg-gray-900/95 rounded-lg p-2 backdrop-blur-sm min-w-[160px]">
              {Object.values(SCENERY_DEFINITIONS).map((def) => (
                <button
                  key={def.type}
                  onClick={() => {
                    setSelectedSceneryType(def.type);
                    setShowSceneryMenu(false);
                  }}
                  className={`w-full text-left px-3 py-1.5 rounded text-xs text-white hover:bg-gray-700 flex justify-between ${
                    selectedSceneryType === def.type ? "bg-blue-600" : ""
                  }`}
                >
                  <span>{def.name}</span>
                  <span className="text-green-400">${def.cost}</span>
                </button>
              ))}
            </div>
          )}
        </div>
        <ToolButton
          label="Demolish"
          icon="💥"
          active={toolMode === ToolMode.DEMOLISH}
          onClick={() => { setToolMode(ToolMode.DEMOLISH); setShowRideMenu(false); setShowSceneryMenu(false); }}
          shortcut="5"
        />
      </div>
    </div>
  );
}
