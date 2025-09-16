import { PrimitiveAtom, atom } from "jotai";

export interface UrlState {
  selectedSatelliteId: string | undefined;
  highlightedSatelliteIds: string[];

  searchText: string;

  filterRadioModes: string[];
}

const selectedSatelliteIdKey = "s";
const highlightedSatelliteIdsKey = "h";
const searchTextKey = "q";
const filterRadioModesKey = "radio-mode";

function readStateFromUrl(): UrlState {
  const searchParams = new URLSearchParams(window.location.search.slice(1));

  return {
    selectedSatelliteId: searchParams.get(selectedSatelliteIdKey) || undefined,
    highlightedSatelliteIds:
      searchParams.getAll(highlightedSatelliteIdsKey) || [],

    searchText: searchParams.get(searchTextKey) || "",
    filterRadioModes: searchParams.getAll(filterRadioModesKey) || [],
  };
}

function writeStateToUrl(state: UrlState) {
  const searchParams = new URLSearchParams();

  if (state.selectedSatelliteId) {
    searchParams.set(selectedSatelliteIdKey, state.selectedSatelliteId);
  }

  for (const h of state.highlightedSatelliteIds.toSorted()) {
    searchParams.append(highlightedSatelliteIdsKey, h);
  }

  if (state.searchText) {
    searchParams.set(searchTextKey, state.searchText);
  }

  for (const m of state.filterRadioModes.toSorted()) {
    searchParams.append(filterRadioModesKey, m);
  }

  searchParams.sort();
  const searchString = searchParams.toString();
  window.history.replaceState(
    null,
    "",
    searchString ? `?${searchString}` : "."
  );
}

const internalUrlStateAtom = atom(readStateFromUrl());

// TODO: Redirect to canonical URL on first load.
const urlStateAtom: PrimitiveAtom<UrlState> = atom(
  (get) => get(internalUrlStateAtom),
  (get, set, update) => {
    set(internalUrlStateAtom, update);
    writeStateToUrl(get(internalUrlStateAtom));
  }
);

export const selectedSatelliteIdAtom = atom(
  (get) => get(urlStateAtom).selectedSatelliteId,
  (_get, set, selectedSatelliteId: UrlState["selectedSatelliteId"]) =>
    set(urlStateAtom, (prev) =>
      prev.selectedSatelliteId === selectedSatelliteId
        ? prev
        : { ...prev, selectedSatelliteId }
    )
);

export const highlightedSatelliteIdsAtom = atom(
  (get) => get(urlStateAtom).highlightedSatelliteIds,
  (_get, set, highlightedSatelliteIds: UrlState["highlightedSatelliteIds"]) =>
    set(urlStateAtom, (prev) =>
      prev.highlightedSatelliteIds === highlightedSatelliteIds
        ? prev
        : { ...prev, highlightedSatelliteIds }
    )
);

export const searchTextAtom = atom(
  (get) => get(urlStateAtom).searchText,
  (_get, set, searchText: UrlState["searchText"]) =>
    set(urlStateAtom, (prev) =>
      prev.searchText === searchText ? prev : { ...prev, searchText }
    )
);

export const filterRadioModesAtom = atom(
  (get) => get(urlStateAtom).filterRadioModes,
  (_get, set, filterRadioModes: UrlState["filterRadioModes"]) =>
    set(urlStateAtom, (prev) =>
      prev.filterRadioModes === filterRadioModes
        ? prev
        : { ...prev, filterRadioModes }
    )
);
