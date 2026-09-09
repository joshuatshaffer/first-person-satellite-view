import { atom, useAtom, useAtomValue } from "jotai";
import { matchSorter } from "match-sorter";
import { ommsAtom } from "../../../satdb/omm";
import { searchTextAtom, selectedSatelliteIdAtom } from "../../urlAtom";
import styles from "./Search.module.css";
import { SearchInput } from "./SearchInput";

export const searchResultsAtom = atom((get) =>
  matchSorter(get(ommsAtom), get(searchTextAtom), {
    keys: ["OBJECT_NAME", "NORAD_CAT_ID", "OBJECT_ID"],
  }),
);

function SearchResultList() {
  const results = useAtomValue(searchResultsAtom);
  const [selectedSatelliteId, setSelectedSatelliteId] = useAtom(
    selectedSatelliteIdAtom,
  );

  return (
    <ul className={styles.searchResults}>
      {results.slice(0, 30).map(({ NORAD_CAT_ID, OBJECT_NAME }) => {
        return (
          <li
            key={NORAD_CAT_ID}
            className={styles.searchResult}
            data-selected={selectedSatelliteId === "" + NORAD_CAT_ID}
            onClick={() => {
              setSelectedSatelliteId("" + NORAD_CAT_ID);
            }}
          >
            <div className={styles.searchResult_objectName}>{OBJECT_NAME}</div>
            <div>{NORAD_CAT_ID}</div>
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
