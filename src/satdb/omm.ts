import { atom } from "jotai";
import { getDb, Omm, withDb } from "./db";
import { daysToMs } from "./ms";

const ommJsonUrl =
  "https://celestrak.org/NORAD/elements/gp.php?GROUP=active&FORMAT=json";

/**
 * CelesTrak updates the OMM data at most every 2 hours.
 */
const ommMaxAgeMs = 1 * daysToMs;

async function fetchOmms({ signal }: { signal?: AbortSignal } = {}) {
  const response = await fetch(ommJsonUrl, { signal });
  return (await response.json()) as Omm[];
}

async function putOmms(omms: Omm[]) {
  const db = await getDb();
  try {
    const tx = db.transaction(["omm", "dataSync"], "readwrite");
    await Promise.all([
      tx.db
        .clear("omm")
        .then(() =>
          Promise.all(
            omms.map((omm) =>
              tx.db.put("omm", omm, omm.NORAD_CAT_ID.toString()),
            ),
          ),
        ),
      tx.db.put("dataSync", new Date(), "omm"),
      tx.done,
    ]);
  } finally {
    db.close();
  }
}

export const ommsAtom = atom<Omm[]>([]);

ommsAtom.onMount = (setAtom) => {
  const abortController = new AbortController();
  const signal = abortController.signal;
  let nextSyncTimeout: ReturnType<typeof setTimeout> | undefined;

  const sync = async () => {
    try {
      const omms = await fetchOmms({ signal });

      // Do not wait for the update to complete before returning the OMMs so
      // that the UI updates faster.
      putOmms(omms).catch((error) => {
        console.error("Failed to save OMMs to IndexedDB", error);
      });

      setAtom(omms);
    } catch (error) {
      console.error("Failed to fetch OMMs", error);
    }

    if (!signal.aborted) {
      await scheduleNextSync();
    }
  };

  const scheduleNextSync = async () => {
    // When the data is more than 2 hours old, fetch new data.
    const lastSynced = await withDb((db) => db.get("dataSync", "omm"));

    const timeUntilNextSync =
      lastSynced === undefined
        ? 0
        : ommMaxAgeMs - (Date.now() - lastSynced.getTime());

    setTimeout(sync, Math.max(0, timeUntilNextSync));
  };

  (async () => {
    setAtom(await withDb((db) => db.getAll("omm")));

    await scheduleNextSync();
  })();

  return () => {
    if (nextSyncTimeout !== undefined) {
      clearTimeout(nextSyncTimeout);
    }
    abortController.abort();
  };
};
