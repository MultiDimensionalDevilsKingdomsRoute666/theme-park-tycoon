import type { TileCoord } from "../types";

interface AStarNode {
  col: number;
  row: number;
  g: number;
  h: number;
  f: number;
  parent: AStarNode | null;
}

function heuristic(a: TileCoord, b: TileCoord): number {
  return Math.abs(a.col - b.col) + Math.abs(a.row - b.row);
}

function coordKey(col: number, row: number): string {
  return `${col},${row}`;
}

export function findPath(
  start: TileCoord,
  end: TileCoord,
  isWalkable: (col: number, row: number) => boolean,
  maxIterations: number = 2000,
): TileCoord[] | null {
  if (!isWalkable(end.col, end.row)) return null;

  const openSet: AStarNode[] = [];
  const closedSet = new Set<string>();

  const startNode: AStarNode = {
    col: start.col,
    row: start.row,
    g: 0,
    h: heuristic(start, end),
    f: heuristic(start, end),
    parent: null,
  };

  openSet.push(startNode);
  let iterations = 0;

  while (openSet.length > 0 && iterations < maxIterations) {
    iterations++;

    let lowestIdx = 0;
    for (let i = 1; i < openSet.length; i++) {
      if (openSet[i].f < openSet[lowestIdx].f) {
        lowestIdx = i;
      }
    }

    const current = openSet[lowestIdx];

    if (current.col === end.col && current.row === end.row) {
      const path: TileCoord[] = [];
      let node: AStarNode | null = current;
      while (node) {
        path.unshift({ col: node.col, row: node.row });
        node = node.parent;
      }
      return path;
    }

    openSet.splice(lowestIdx, 1);
    closedSet.add(coordKey(current.col, current.row));

    const neighbors = [
      { col: current.col - 1, row: current.row },
      { col: current.col + 1, row: current.row },
      { col: current.col, row: current.row - 1 },
      { col: current.col, row: current.row + 1 },
    ];

    for (const neighbor of neighbors) {
      const key = coordKey(neighbor.col, neighbor.row);
      if (closedSet.has(key)) continue;
      if (!isWalkable(neighbor.col, neighbor.row)) continue;

      const g = current.g + 1;
      const existing = openSet.find(
        (n) => n.col === neighbor.col && n.row === neighbor.row,
      );

      if (existing) {
        if (g < existing.g) {
          existing.g = g;
          existing.f = g + existing.h;
          existing.parent = current;
        }
      } else {
        const h = heuristic(neighbor, end);
        openSet.push({
          col: neighbor.col,
          row: neighbor.row,
          g,
          h,
          f: g + h,
          parent: current,
        });
      }
    }
  }

  return null;
}
