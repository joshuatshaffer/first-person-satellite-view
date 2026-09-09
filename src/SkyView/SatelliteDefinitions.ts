import { atom } from "jotai";
import * as satellite from "satellite.js";
import { NoradId, Omm } from "../satdb/db";
import { ommsAtom } from "../satdb/omm";

export const satelliteDefinitionsAtom = atom((get) => {
  const definitions = new Map<NoradId, Omm>();
  const records = new Map<NoradId, satellite.SatRec>();

  for (const omm of get(ommsAtom)) {
    const id = "" + omm.NORAD_CAT_ID;

    definitions.set(id, omm);
    records.set(
      id,
      satellite.json2satrec(omm as Omm & Record<string, unknown>),
    );
  }

  return { definitions, records };
});
