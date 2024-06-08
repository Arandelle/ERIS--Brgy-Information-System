// ActionButton.js
import React from "react";
import { toast } from "sonner";

const ActionButton = ({ selectedUsers }) => {
  const actions = [
    { title: "Add user", type: "add" },
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

  return (
    <ul className="py-1 text-sm text-gray-700 dark:text-gray-200">
      {actions.map((action, key) => (
        <li key={key}>
          <button
            type="button"
            onClick={() => handleButton(action.type)}
            disabled={action.type !== "add" && selectedUsers.length === 0}
            className={`w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white ${
              action.title === "Delete user"
                ? "border-t-2 border-grey-200 text-red-500"
                : ""
            } ${
              action.type !== "add" && selectedUsers.length === 0
                ? "cursor-not-allowed"
                : "cursor-pointer"
            }`}
          >
            {action.title}
          </button>
        </li>
      ))}
    </ul>
  );
};

export default ActionButton;
