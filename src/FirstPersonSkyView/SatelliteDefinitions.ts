import { atom } from "jotai";
import * as satellite from "satellite.js";
import { NoradId } from "../satdb/db";
import { ommsAtom } from "../satdb/omm";

export interface SatelliteDefinition {
  displayName: string;
  cosparId: string;
}

export const satelliteDefinitionsAtom = atom((get) => {
  const definitions = new Map<NoradId, SatelliteDefinition>();
  const records = new Map<NoradId, satellite.SatRec>();

  for (const omm of get(ommsAtom)) {
    const record = satellite.json2satrec(omm);

    const id = record.satnum;

    definitions.set(id, {
      displayName: omm.OBJECT_NAME,
      cosparId: omm.OBJECT_ID,
    });
    records.set(id, record);
  }

  return { definitions, records };
});
