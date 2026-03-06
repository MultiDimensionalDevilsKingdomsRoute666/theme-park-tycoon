import { DAY_DURATION } from "../constants";

export class TimeSystem {
  timeOfDay = 0;
  day = 1;

  update(dt: number, speed: number): void {
    this.timeOfDay += (dt * speed) / DAY_DURATION;
    if (this.timeOfDay >= 1) {
      this.timeOfDay -= 1;
      this.day++;
    }
  }
}
