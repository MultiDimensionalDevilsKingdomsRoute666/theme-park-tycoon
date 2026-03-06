import { RideManager } from "../entities/RideManager";

export class EconomySystem {
  getTotalRevenue(rideManager: RideManager): number {
    return rideManager.rides.reduce((sum, r) => sum + r.totalRevenue, 0);
  }

  getTotalRides(rideManager: RideManager): number {
    return rideManager.rides.reduce((sum, r) => sum + r.totalRides, 0);
  }
}
