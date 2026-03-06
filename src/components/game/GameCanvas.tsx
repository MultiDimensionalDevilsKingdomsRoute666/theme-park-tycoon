"use client";

import { useRef, useEffect, useCallback } from "react";
import { useGameStore } from "@/store/gameStore";
import { Camera } from "@/engine/core/Camera";
import { GameLoop } from "@/engine/core/GameLoop";
import { InputManager } from "@/engine/core/InputManager";
import { TilePicker } from "@/engine/core/TilePicker";
import { Renderer } from "@/engine/render/Renderer";
import { TileMap } from "@/engine/world/TileMap";
import { RideManager } from "@/engine/entities/RideManager";
import { SceneryManager } from "@/engine/entities/SceneryManager";
import { GuestManager } from "@/engine/entities/GuestManager";
import { PlacementManager } from "@/engine/placement/PlacementManager";
import { TimeSystem } from "@/engine/simulation/TimeSystem";
import { HappinessSystem } from "@/engine/simulation/HappinessSystem";
import { CleanlinessSystem } from "@/engine/simulation/CleanlinessSystem";
import { ParkManager } from "@/engine/simulation/ParkManager";
import { RIDE_DEFINITIONS } from "@/data/rides";
import { tileToScreen } from "@/engine/math/isometric";
import { MAP_SIZE, ENTRANCE_COL, ENTRANCE_ROW } from "@/engine/constants";
import { Terrain } from "@/engine/types";
import type { Particle, RideInstance, SceneryInstance } from "@/engine/types";
import { randomFloat, randomId } from "@/engine/math/random";
import TopBar from "@/components/ui/TopBar";
import Toolbar from "@/components/ui/Toolbar";
import SidePanel from "@/components/ui/SidePanel";
import ToastContainer from "@/components/ui/ToastContainer";

export default function GameCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const engineRef = useRef<{
    camera: Camera;
    gameLoop: GameLoop;
    inputManager: InputManager;
    tileMap: TileMap;
    renderer: Renderer;
    rideManager: RideManager;
    sceneryManager: SceneryManager;
    guestManager: GuestManager;
    placementManager: PlacementManager;
    timeSystem: TimeSystem;
    happinessSystem: HappinessSystem;
    cleanlinessSystem: CleanlinessSystem;
    parkManager: ParkManager;
    particles: Particle[];
    time: number;
    rideSnapshot: RideInstance[];
    scenerySnapshot: SceneryInstance[];
  } | null>(null);

  const ridesRef = useRef<RideInstance[]>([]);
  const sceneryRef = useRef<SceneryInstance[]>([]);

  const forceUpdateRef = useRef(0);

  const init = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const camera = new Camera();
    camera.resize(canvas.width, canvas.height);

    const centerPos = tileToScreen(MAP_SIZE / 2, MAP_SIZE / 2);
    camera.centerOn(centerPos.x, centerPos.y);

    const tilePicker = new TilePicker();
    const tileMap = new TileMap();

    for (let i = 0; i < 5; i++) {
      tileMap.setTerrain(ENTRANCE_COL + i, ENTRANCE_ROW, Terrain.PATH);
    }

    const rideManager = new RideManager();
    const sceneryManager = new SceneryManager();
    const guestManager = new GuestManager();
    const placementManager = new PlacementManager(tileMap, rideManager, sceneryManager);

    const timeSystem = new TimeSystem();
    const happinessSystem = new HappinessSystem();
    const cleanlinessSystem = new CleanlinessSystem();
    const parkManager = new ParkManager();

    const renderer = new Renderer(ctx, camera);
    const particles: Particle[] = [];
    let time = 0;

    const store = useGameStore.getState;
    const storeMethods = {
      addMoney: useGameStore.getState().addMoney,
      addToast: useGameStore.getState().addToast,
      setSelectedEntityId: useGameStore.getState().setSelectedEntityId,
      setHoveredTile: useGameStore.getState().setHoveredTile,
      setDay: useGameStore.getState().setDay,
      setTimeOfDay: useGameStore.getState().setTimeOfDay,
      setParkRating: useGameStore.getState().setParkRating,
      setTotalGuests: useGameStore.getState().setTotalGuests,
      setHappiness: useGameStore.getState().setHappiness,
      setCleanliness: useGameStore.getState().setCleanliness,
    };

    let simAccum = 0;

    const onUpdate = (dt: number) => {
      const state = store();
      const effectiveDt = state.paused ? 0 : dt * state.speed;

      camera.update();
      time += dt;

      if (!state.paused) {
        timeSystem.update(effectiveDt, 1);
        storeMethods.setDay(timeSystem.day);
        storeMethods.setTimeOfDay(timeSystem.timeOfDay);

        guestManager.setSpawnRate(state.parkRating);
        guestManager.update(effectiveDt, tileMap, rideManager, storeMethods.addMoney);

        rideManager.update(effectiveDt, (ride) => {
          const def = RIDE_DEFINITIONS[ride.type];
          guestManager.onRideCycleComplete(ride, def.excitement);

          for (let i = 0; i < 5; i++) {
            const pos = tileToScreen(
              ride.col + def.footprint.width / 2,
              ride.row + def.footprint.height / 2,
            );
            const sx = (pos.x - camera.x) * camera.zoom;
            const sy = (pos.y - camera.y) * camera.zoom;
            particles.push({
              x: sx + randomFloat(-20, 20),
              y: sy + randomFloat(-30, -10),
              vx: randomFloat(-1, 1),
              vy: randomFloat(-2, -0.5),
              life: 1,
              maxLife: 1,
              color: "#f1c40f",
              size: randomFloat(2, 4),
            });
          }
        });

        cleanlinessSystem.update(effectiveDt, tileMap, guestManager.guests);

        simAccum += effectiveDt;
        if (simAccum > 1000) {
          simAccum = 0;
          const happiness = happinessSystem.calculate(
            guestManager.guests,
            sceneryManager,
            tileMap,
          );
          const cleanliness = cleanlinessSystem.calculate(tileMap);
          const rating = parkManager.calculateRating(
            happiness,
            cleanliness,
            rideManager,
            guestManager.guests.length,
          );

          storeMethods.setHappiness(happiness);
          storeMethods.setCleanliness(cleanliness);
          storeMethods.setParkRating(rating);
          storeMethods.setTotalGuests(guestManager.guests.length);
        }
      }

      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.x += p.vx;
        p.y += p.vy;
        p.life -= 0.02;
        if (p.life <= 0) particles.splice(i, 1);
      }

      ridesRef.current = [...rideManager.rides];
      sceneryRef.current = [...sceneryManager.items];
    };

    const onRender = () => {
      const state = store();
      renderer.clear();
      renderer.renderTiles(tileMap);
      renderer.renderScenery(sceneryManager.items);
      renderer.renderRides(rideManager.rides, time);
      renderer.renderGuests(guestManager.guests, time);

      const rideDef = state.selectedRideType
        ? RIDE_DEFINITIONS[state.selectedRideType]
        : null;
      renderer.renderOverlay(state.hoveredTile, state.toolMode, tileMap, rideDef);
      renderer.renderParticles(particles);
      renderer.renderMinimap(tileMap);
      renderer.renderNightOverlay(state.timeOfDay);
    };

    const gameLoop = new GameLoop(onUpdate, onRender);

    const onClick = (col: number, row: number) => {
      const state = store();
      placementManager.handleClick(
        col,
        row,
        state.toolMode,
        state.selectedRideType,
        state.selectedSceneryType,
        state.money,
        storeMethods.addMoney,
        storeMethods.addToast,
        storeMethods.setSelectedEntityId,
      );
    };

    const onDrag = (col: number, row: number) => {
      const state = store();
      placementManager.handleDrag(
        col,
        row,
        state.toolMode,
        state.money,
        storeMethods.addMoney,
        storeMethods.addToast,
      );
    };

    const onHover = (col: number, row: number) => {
      storeMethods.setHoveredTile({ col, row });
    };

    const inputManager = new InputManager(
      canvas,
      camera,
      tilePicker,
      onClick,
      onDrag,
      onHover,
    );

    inputManager.attach();
    gameLoop.start();

    engineRef.current = {
      camera,
      gameLoop,
      inputManager,
      tileMap,
      renderer,
      rideManager,
      sceneryManager,
      guestManager,
      placementManager,
      timeSystem,
      happinessSystem,
      cleanlinessSystem,
      parkManager,
      particles,
      time,
      rideSnapshot: [],
      scenerySnapshot: [],
    };

    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      camera.resize(canvas.width, canvas.height);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      gameLoop.stop();
      inputManager.detach();
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  useEffect(() => {
    const cleanup = init();
    return () => cleanup?.();
  }, [init]);

  useEffect(() => {
    const interval = setInterval(() => {
      forceUpdateRef.current++;
    }, 500);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative w-screen h-screen overflow-hidden bg-gray-950">
      <canvas ref={canvasRef} className="block" />
      <TopBar />
      <Toolbar />
      <SidePanel rides={ridesRef.current} scenery={sceneryRef.current} />
      <ToastContainer />
    </div>
  );
}
