import { toast } from "sonner";
import icons from "../../../assets/icons/Icons";

const ActionButton = ({
  selectedUsers,
  filteredResidents,
  toggleAction,
  isActionOpen,
  setActionOpen,
  setAddUser,
}) => {
  const actions = [
    { title: "Add user", type: "add" },
    // { title: "Reset password", type: "reset" },
    // { title: "Send email", type: "email" },
    // // { title: "Activate user", type: "activate" },
    // { title: "Archive user", type: "archive" },
    // { title: "Delete user", type: "delete" },
    {title: "Lock user", type: "lock"}
  ];

  const handleButton = (type) => {
    if (type === "delete") {
      toast.error(`this button is ${type}`);
    } else if (type === "add") {
      setAddUser(true);
    } else {
      toast.warning(`this button is ${type}`);
    }
    setActionOpen(false);
  };

  const isActionDisabled = (actionType) => {

    if (actionType === "add") {
      return false; // The "add" action is never disabled
    }
  
    if (selectedUsers.length === 0) {
      return true; 
    }
  
    if (actionType === "reset" && selectedUsers.length !== 1) {
      return true;
    }

    // if (actionType === "activate") {
    //   return selectedUsers.some(
    //     (userId) =>
    //       filteredResidents.find((resident) => resident.id === userId)
    //         .status === "Verified"
    //   );  // return true 
    // }

    if (actionType === "email") {
      const hasVerified = selectedUsers.some(
        (userId) => filteredResidents.find((resident) => resident.id === userId).status === "Verified"
      );
  
      const hasNotVerified = selectedUsers.some(
        (userId) => filteredResidents.find((resident) => resident.id === userId).status === "Not Verified"
      );
  
      // The "email" action is disabled (returns true) if both "Verified" and "Not Verified" users are selected
      // Otherwise, it is enabled (returns false)
      return hasVerified && hasNotVerified;
    }
  
    // By default, other actions are not disabled (return false)
    return false;
  };
  

  return (
    <div>
      <button
        onClick={toggleAction}
        className="inline-flex justify-between items-center text-nowrap text-gray-500 bg-white border border-gray-300 focus:outline-none hover:bg-gray-100 focus:ring-4 focus:ring-gray-100 font-medium rounded-lg text-sm px-3 py-1.5 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:bg-gray-700 dark:hover:border-gray-600 dark:focus:ring-gray-700"
        type="button"
      >
        <span className="sr-only">Action button</span>
        Action
        <icons.arrowDropDown style={{ fontSize: "large" }} />
      </button>
      {/* Dropdown menu */}
      {isActionOpen && (
        <div
          id="dropdownAction"
          className="z-10 absolute bg-white divide-y divide-gray-100 rounded-lg shadow w-44 dark:bg-gray-700 dark:divide-gray-600"
        >
          <ul className="py-1 text-sm text-gray-700 dark:text-gray-200">
            {actions.map((action, key) => (
              <li key={key}>
                <button
                  type="button"
                  onClick={() => handleButton(action.type)}
                  disabled={isActionDisabled(action.type)}
                  className={`w-full text-left px-4 py-2  ${
                    action.title === "Delete user" || action.title === "Lock user"
                      ? "border-t-2 border-grey-200 text-red-500"
                      : ""
                  } ${
                    isActionDisabled(action.type)
                      ? "cursor-not-allowed text-gray-400"
                      : "hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
                  }`}
                >
                  {action.title}
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default ActionButton;
