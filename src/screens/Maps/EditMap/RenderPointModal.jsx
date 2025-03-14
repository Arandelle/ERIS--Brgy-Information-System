import Modal from "../../../components/ReusableComponents/Modal";
import { InputField } from "../../../components/ReusableComponents/InputField";

export const RenderPointModal = ({
  manualPointModal,
  setManualPointModal,
  addManualPoint,
  latitudeInput,
  setLatitudeInput,
  longitudeInput,
  setLongitudeInput,
}) => {
  if (!manualPointModal) return null;

  return (
    <Modal
      closeButton={() => setManualPointModal((prev) => !prev)}
      title={"Add Exact Coordinates"}
      children={
        <div className="max-w-2xl space-y-6">
          <p className="text-sm text-gray-600 dark:text-gray-300 italic">
            Enter the exact latitude and longitude coordinates to ensure the
            location is correctly identified on the map
          </p>

          <form className="flex flex-col space-y-2" onSubmit={addManualPoint}>
            <label className="text-gray-600">Latitude: </label>
            <InputField
              type="number"
              placeholder={"Enter latitude (e.g., 37.7749)"}
              value={latitudeInput}
              onChange={(e) => setLatitudeInput(e.target.value)}
              required={true}
            />
            <label className="text-gray-600">Longitude: </label>
            <InputField
              type="number"
              placeholder={"Enter longitude (e.g., -122.4194)"}
              value={longitudeInput}
              onChange={(e) => setLongitudeInput(e.target.value)}
              required={true}
            />
            <button
              type="submit"
              className="bg-blue-500 py-3 rounded-md text-white font-bold text-sm w-full"
            >
              Add Point
            </button>
          </form>
        </div>
      }
    />
  );
};