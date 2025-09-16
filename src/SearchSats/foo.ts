import * as SatnogsApi from "../generated/satnogs-api";
import { SatnogsTransmitter } from "./SatnogsApi";

export function transform(
  satellites: SatnogsApi.Satellite[],
  transmitters: SatnogsTransmitter[]
) {
  const modes = new Set<SatnogsTransmitter["mode"]>();

  for (const transmitter of transmitters) {
    if (transmitter.mode) {
      modes.add(transmitter.mode);
    }

    if (transmitter.uplink_mode) {
      modes.add(transmitter.uplink_mode);
    }
  }
}
