import { DBSchema, IDBPDatabase, openDB } from "idb";

export type NoradId = string;

/**
 * Two/Three Line Element
 */
export interface Tle {
  objectName: string;
  line1: string;
  line2: string;
}

/**
 * Orbit Mean Elements Message
 */
export interface Omm {
  OBJECT_NAME: string;
  OBJECT_ID: string;
  EPOCH: string;
  MEAN_MOTION: number;
  ECCENTRICITY: number;
  INCLINATION: number;
  RA_OF_ASC_NODE: number;
  ARG_OF_PERICENTER: number;
  MEAN_ANOMALY: number;
  NORAD_CAT_ID: number;
  ELEMENT_SET_NO: number;
  BSTAR: number;
  MEAN_MOTION_DOT: number;
  MEAN_MOTION_DDOT: number;
  EPHEMERIS_TYPE?: 0 | undefined;
  CLASSIFICATION_TYPE?: "U" | "C" | undefined;
  REV_AT_EPOCH?: number | undefined;
}

export type DataSyncKey = "tle";

interface SatDbSchema extends DBSchema {
  dataSync: { value: Date; key: DataSyncKey };
  tle: { value: Tle; key: NoradId };
  omm: { value: Omm; key: NoradId };
}

export interface Db extends IDBPDatabase<SatDbSchema> {}

// TODO: Use the `using` keyword instead of `try`/`finally`.
//
// TODO: Reuse the database connection if `getDb` is called multiple times
//       before closing.
export async function getDb() {
  return await openDB<SatDbSchema>("sat-db", 1, {
    upgrade(db) {
      db.createObjectStore("dataSync");
      db.createObjectStore("tle");
    },
  });
}

export async function withDb<T>(fn: (db: Db) => PromiseLike<T>) {
  const db = await getDb();
  try {
    return await fn(db);
  } finally {
    db.close();
  }
}
