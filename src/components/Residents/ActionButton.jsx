// ActionButton.js
import React from "react";
import { toast } from "sonner";

const ActionButton = ({ selectedUsers,residents,filteredResidents }) => {
  const actions = [
    { title: "Add user", type: "add" },
    { title: "Reset password", type: "reset" },
    { title: "Send email", type: "email" },
    { title: "Activate user", type: "activate" },
    { title: "Archive user", type: "archive" },
    { title: "Delete user", type: "delete" },
  ];

  const handleButton = (type) => {
    if (type === "delete") {
      toast.error(`this button is ${type}`);
    } else {
      toast.warning(`this button is ${type}`);
    }
  };

  const isActionDisabled = (actionType) => {
    if (actionType === "add") {
      return false;
    }
    if (selectedUsers.length === 0) {
      return true;
    }
    if (actionType === "reset" && selectedUsers.length !== 1) {
      return true;
    }
    if (actionType === "activate") {
      return selectedUsers.some(
        (userId) => filteredResidents.find((resident) => resident.id === userId).status === "Activated"
      );
    }
    return false;
  };
  

  return (
    <ul className="py-1 text-sm text-gray-700 dark:text-gray-200">
      {actions.map((action, key) => (
        <li key={key}>
          <button
            type="button"
            onClick={() => handleButton(action.type)}
            disabled={action.type !== "add" && selectedUsers.length === 0}
            className={`w-full text-left px-4 py-2  ${
              action.title === "Delete user"
                ? "border-t-2 border-grey-200 text-red-500"
                : ""
            } ${
              isActionDisabled(action.type)
                ? "cursor-not-allowed text-gray-400"
                : "cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
            }`
               
          }
          >
            {action.title}
          </button>
        </li>
      ))}
    </ul>
  );
};

export default ActionButton;
