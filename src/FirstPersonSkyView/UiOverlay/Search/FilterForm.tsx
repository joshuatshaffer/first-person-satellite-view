import { useAtom } from "jotai";
import { filterRadioModesAtom } from "../../urlAtom";

const modes = ["FM", "AM", "USB", "LSB"];

export function FilterForm() {
  const [filterRadioModes, setFilterRadioModes] = useAtom(filterRadioModesAtom);

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
      <div>
        Frequency{" "}
        <input
          type="number"
          name="frequency-min"
          min={0}
          max={40_000_000_000}
          defaultValue={0}
          style={{ textAlign: "right" }}
        />{" "}
        <input
          type="number"
          name="frequency-max"
          min={0}
          max={40_000_000_000}
          defaultValue={40_000_000_000}
          style={{ textAlign: "right" }}
        />
      </div>
    </div>
  );
}
