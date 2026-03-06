# Theme Park Tycoon

A browser-based isometric theme park simulation game inspired by RollerCoaster Tycoon. Build rides, lay paths, plant scenery, and manage guests to create the ultimate theme park.

## Play

Visit the deployed game or run locally:

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Controls

| Input | Action |
|-------|--------|
| **WASD** / Arrow Keys | Pan camera |
| **Mouse Wheel** | Zoom in/out (0.5x - 2x) |
| **Left Click** | Place item / Select |
| **Click + Drag** | Draw paths / Demolish multiple |
| **1-5** | Switch tools (Select, Path, Ride, Scenery, Demolish) |
| **Space** | Pause / Resume |

## Tools

| # | Tool | Description |
|---|------|-------------|
| 1 | **Select** | Click rides/scenery to view stats |
| 2 | **Path** | Draw walkable paths ($50 each). Drag to draw continuously |
| 3 | **Rides** | Place rides from 6 types. Must be adjacent to a path |
| 4 | **Scenery** | Place decorations from 8 types to boost guest happiness |
| 5 | **Demolish** | Remove anything for 50% refund |

## Rides

| Ride | Cost | Capacity | Excitement | Ticket |
|------|------|----------|------------|--------|
| Roller Coaster | $3,000 | 12 | 90% | $8 |
| Ferris Wheel | $2,000 | 16 | 50% | $5 |
| Carousel | $1,000 | 8 | 30% | $3 |
| Bumper Cars | $1,500 | 10 | 60% | $4 |
| Drop Tower | $2,500 | 6 | 85% | $7 |
| Log Flume | $2,200 | 8 | 70% | $6 |

## Scenery

Oak Tree ($100), Pine Tree ($80), Palm Tree ($120), Bench ($50), Fountain ($300), Lamp Post ($60), Flower Bed ($75), Food Stall ($500)

## Game Mechanics

- **Starting Money:** $10,000
- **Park Rating:** 0-999, calculated from happiness, cleanliness, ride variety, and guest count
- **Guest AI:** Guests enter via the park entrance, use A* pathfinding to navigate paths, queue for rides, and leave after riding a few attractions
- **Happiness:** Boosted by rides and nearby scenery, reduced by dirty paths and long queues
- **Cleanliness:** Degrades as guests walk on paths. Dirty paths reduce guest happiness
- **Day/Night Cycle:** Visual dimming effect as days progress
- **Speed Controls:** 1x, 2x, 3x, or paused
- **Guest Cap:** 200 simultaneous guests

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 16 (App Router, static export) |
| Language | TypeScript (strict mode) |
| Rendering | HTML5 Canvas 2D (procedural pixel art) |
| State | Zustand |
| Styling | Tailwind CSS v4 |
| Deploy | Vercel |

## Project Structure

```
src/
  app/          - Next.js app router pages
  components/
    game/       - GameCanvas (main game component)
    ui/         - TopBar, Toolbar, SidePanel, ToastContainer
  engine/
    core/       - Camera, GameLoop, InputManager, TilePicker
    entities/   - RideManager, SceneryManager, GuestManager
    math/       - Isometric transforms, A* pathfinding, random utils
    placement/  - PlacementManager (handles all build/demolish logic)
    render/     - Tile, Ride, Scenery, Guest, Overlay, Particle renderers
    simulation/ - TimeSystem, HappinessSystem, CleanlinessSystem, ParkManager
    world/      - TileMap, PathGraph
  data/         - Ride/scenery definitions, game config
  store/        - Zustand store and selectors
```

## Architecture

The game uses a clean separation between the Canvas-based game engine and React UI overlays:

- **Game Loop** runs at 60 FPS via `requestAnimationFrame`, updating game state and rendering
- **Zustand store** bridges the engine and React — the game loop writes via `getState()`, React components subscribe selectively
- **Renderers** are pure Canvas drawing classes with no React dependency
- **All assets** are procedurally drawn on Canvas — no external sprite files

## Building

```bash
npm run build    # Produces static export in /out
```

## License

MIT
