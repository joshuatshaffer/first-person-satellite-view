import type * as schema from "../generated/satnogs-api";

export interface SatnogsTransmitter
  extends Omit<schema.Transmitter, "mode" | "uplink_mode"> {
  mode: string;
  uplink_mode: string | null;
}
