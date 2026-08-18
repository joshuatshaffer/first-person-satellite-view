import { atom, useAtom, useAtomValue } from "jotai";
import { matchSorter } from "match-sorter";
import { ommsAtom } from "../../../satdb/omm";
import { searchTextAtom, selectedSatelliteIdAtom } from "../../urlAtom";
import styles from "./Search.module.css";
import { SearchInput } from "./SearchInput";

export const searchResultsAtom = atom((get) =>
  matchSorter(
    get(ommsAtom).map((omm) => ({
      ...omm,
      noradId: omm.NORAD_CAT_ID.toString(),
      cosparId: omm.OBJECT_ID,
    })),
    get(searchTextAtom),
    {
      keys: ["OBJECT_NAME", "noradId", "cosparId"],
    },
  ),
);

function SearchResultList() {
  const results = useAtomValue(searchResultsAtom);
  const [selectedSatelliteId, setSelectedSatelliteId] = useAtom(
    selectedSatelliteIdAtom,
  );

  return (
    <ul className={styles.searchResults}>
      {results.slice(0, 30).map(({ noradId, OBJECT_NAME }) => {
        return (
          <li
            key={noradId}
            className={styles.searchResult}
            data-selected={selectedSatelliteId === noradId}
            onClick={() => {
              setSelectedSatelliteId(noradId);
            }}
          >
            <div className={styles.searchResult_objectName}>{OBJECT_NAME}</div>
            <div>{noradId}</div>
          </li>
        );
      })}
    </ul>
  );
}

export function Search() {
  return (
    <div className={styles.search}>
      <SearchInput />
      <SearchResultList />
    </div>
  );
}
