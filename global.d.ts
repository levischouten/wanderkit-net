import { Destination, Duration } from "@/app/schema";
import "little-state-machine";

declare module "little-state-machine" {
  interface GlobalState {
    destination: Destination;
    duration: Duration;
  }
}
