import { MAX_PARK_RATING } from "../constants";
import { RideManager } from "../entities/RideManager";

export class ParkManager {
  calculateRating(
    happiness: number,
    cleanliness: number,
    rideManager: RideManager,
    guestCount: number,
  ): number {
    const rideVariety = new Set(rideManager.rides.map((r) => r.type)).size;
    const rideCount = rideManager.rides.length;

    const happinessScore = happiness * 3;
    const cleanlinessScore = cleanliness * 2;
    const varietyScore = rideVariety * 40;
    const rideCountScore = Math.min(rideCount * 20, 200);
    const guestScore = Math.min(guestCount * 2, 100);

    const raw = happinessScore + cleanlinessScore + varietyScore + rideCountScore + guestScore;
    return Math.min(MAX_PARK_RATING, Math.max(0, Math.round(raw)));
  }
}
