export enum Terrain {
  GRASS = "grass",
  PATH = "path",
  WATER = "water",
  DIRT = "dirt",
}

export enum ToolMode {
  SELECT = "select",
  PATH = "path",
  RIDE = "ride",
  SCENERY = "scenery",
  DEMOLISH = "demolish",
}

export enum RideType {
  ROLLER_COASTER = "roller_coaster",
  FERRIS_WHEEL = "ferris_wheel",
  CAROUSEL = "carousel",
  BUMPER_CARS = "bumper_cars",
  DROP_TOWER = "drop_tower",
  LOG_FLUME = "log_flume",
}

export enum SceneryType {
  OAK_TREE = "oak_tree",
  PINE_TREE = "pine_tree",
  PALM_TREE = "palm_tree",
  BENCH = "bench",
  FOUNTAIN = "fountain",
  LAMP_POST = "lamp_post",
  FLOWER_BED = "flower_bed",
  FOOD_STALL = "food_stall",
}

export enum GuestState {
  ENTERING = "entering",
  WANDERING = "wandering",
  WALKING_TO_RIDE = "walking_to_ride",
  QUEUING = "queuing",
  RIDING = "riding",
  LEAVING = "leaving",
}

export interface Position {
  x: number;
  y: number;
}

export interface TileCoord {
  col: number;
  row: number;
}

export interface Tile {
  col: number;
  row: number;
  terrain: Terrain;
  rideId: string | null;
  sceneryId: string | null;
  dirtLevel: number;
}

export interface RideDefinition {
  type: RideType;
  name: string;
  cost: number;
  footprint: { width: number; height: number };
  capacity: number;
  cycleDuration: number;
  excitement: number;
  ticketPrice: number;
  color: string;
}

export interface RideInstance {
  id: string;
  type: RideType;
  col: number;
  row: number;
  queue: string[];
  riders: string[];
  cycleTimer: number;
  isRunning: boolean;
  totalRides: number;
  totalRevenue: number;
}

export interface SceneryDefinition {
  type: SceneryType;
  name: string;
  cost: number;
  happinessBonus: number;
  color: string;
}

export interface SceneryInstance {
  id: string;
  type: SceneryType;
  col: number;
  row: number;
}

export interface Guest {
  id: string;
  col: number;
  row: number;
  prevCol: number;
  prevRow: number;
  moveProgress: number;
  state: GuestState;
  happiness: number;
  money: number;
  color: string;
  targetRideId: string | null;
  path: TileCoord[];
  pathIndex: number;
  waitTime: number;
  ridesRidden: number;
}

export interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
  color: string;
  size: number;
}

export interface Toast {
  id: string;
  message: string;
  type: "info" | "success" | "warning" | "error";
  timer: number;
}

export interface GameState {
  money: number;
  day: number;
  timeOfDay: number;
  speed: number;
  paused: boolean;
  parkRating: number;
  totalGuests: number;
  happiness: number;
  cleanliness: number;
  toolMode: ToolMode;
  selectedRideType: RideType | null;
  selectedSceneryType: SceneryType | null;
  selectedEntityId: string | null;
  hoveredTile: TileCoord | null;
  toasts: Toast[];
}
