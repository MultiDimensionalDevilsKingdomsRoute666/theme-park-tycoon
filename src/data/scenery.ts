import { SceneryType } from "@/engine/types";
import type { SceneryDefinition } from "@/engine/types";

export const SCENERY_DEFINITIONS: Record<SceneryType, SceneryDefinition> = {
  [SceneryType.OAK_TREE]: {
    type: SceneryType.OAK_TREE,
    name: "Oak Tree",
    cost: 100,
    happinessBonus: 3,
    color: "#27ae60",
  },
  [SceneryType.PINE_TREE]: {
    type: SceneryType.PINE_TREE,
    name: "Pine Tree",
    cost: 80,
    happinessBonus: 2,
    color: "#1e8449",
  },
  [SceneryType.PALM_TREE]: {
    type: SceneryType.PALM_TREE,
    name: "Palm Tree",
    cost: 120,
    happinessBonus: 4,
    color: "#2ecc71",
  },
  [SceneryType.BENCH]: {
    type: SceneryType.BENCH,
    name: "Bench",
    cost: 50,
    happinessBonus: 2,
    color: "#8b4513",
  },
  [SceneryType.FOUNTAIN]: {
    type: SceneryType.FOUNTAIN,
    name: "Fountain",
    cost: 300,
    happinessBonus: 8,
    color: "#5dade2",
  },
  [SceneryType.LAMP_POST]: {
    type: SceneryType.LAMP_POST,
    name: "Lamp Post",
    cost: 60,
    happinessBonus: 1,
    color: "#f39c12",
  },
  [SceneryType.FLOWER_BED]: {
    type: SceneryType.FLOWER_BED,
    name: "Flower Bed",
    cost: 75,
    happinessBonus: 5,
    color: "#e91e63",
  },
  [SceneryType.FOOD_STALL]: {
    type: SceneryType.FOOD_STALL,
    name: "Food Stall",
    cost: 500,
    happinessBonus: 6,
    color: "#ff9800",
  },
};
