import { useAtom } from "jotai";
import { viewControlModeAtom, viewControlModes } from "../../settings";
import { SelectField } from "./SelectField";

export function ViewControlSettings() {
  const [viewControlMode, setViewControlMode] = useAtom(viewControlModeAtom);

  return (
    <>
      <SelectField
        label="View Mode"
        options={viewControlModes}
        getOptionLabel={(option) =>
          ({
            drag: "Drag",
            deviceOrientation: "Device Orientation",
          })[option]
        }
        value={viewControlMode}
        onChange={setViewControlMode}
      />
    </>
  );
}
