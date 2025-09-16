import { useAtom } from "jotai";
import {
  filterFrequencyMaxAtom,
  filterFrequencyMinAtom,
  filterRadioModesAtom,
} from "../../urlAtom";

const modes = ["FM", "AM", "USB", "LSB"];

export function FilterForm() {
  const [filterRadioModes, setFilterRadioModes] = useAtom(filterRadioModesAtom);

  const [filterFrequencyMin, setFilterFrequencyMinAtom] = useAtom(
    filterFrequencyMinAtom
  );
  const [filterFrequencyMax, setFilterFrequencyMaxAtom] = useAtom(
    filterFrequencyMaxAtom
  );

  return (
    <div>
      <div>
        {modes.map((mode) => (
          <label key={mode}>
            <input
              type="checkbox"
              name="radio-mode"
              value={mode}
              checked={filterRadioModes.includes(mode)}
              onChange={(event) => {
                setFilterRadioModes(
                  event.currentTarget.checked
                    ? [...filterRadioModes, mode]
                    : filterRadioModes.filter((m) => m !== mode)
                );
              }}
            />
            <span>{mode}</span>
          </label>
        ))}
      </div>
      <fieldset>
        <legend> Frequency</legend>
        <input
          type="number"
          name="frequency-min"
          aria-label="Minimum frequency"
          min={0}
          max={40_000_000_000}
          defaultValue={0}
          style={{ textAlign: "right" }}
          value={filterFrequencyMin}
          onChange={(event) => {
            const value = event.currentTarget.valueAsNumber;
            setFilterFrequencyMinAtom(Number.isNaN(value) ? undefined : value);
          }}
        />{" "}
        <input
          type="number"
          name="frequency-max"
          aria-label="Maximum frequency"
          min={0}
          max={40_000_000_000}
          defaultValue={40_000_000_000}
          style={{ textAlign: "right" }}
          value={filterFrequencyMax}
          onChange={(event) => {
            const value = event.currentTarget.valueAsNumber;
            setFilterFrequencyMaxAtom(Number.isNaN(value) ? undefined : value);
          }}
        />
      </fieldset>
    </div>
  );
}
