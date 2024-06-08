import React from 'react';

export const HeaderData = ["Name", "Address", "Age", "Gender", "Status", "Action"];

const ActionButton = ({ baseLink, handleActionMenu }) => {

  const actions = [
    { title: "Add user", link: `${baseLink}/add` },
    { title: "Activate user", link: `${baseLink}/activate` },
    { title: "Archive user", link: `${baseLink}/archive`},
    { title: "Delete user", link: `${baseLink}/delete` }
  ];

  return (
    <ul className="py-1 text-sm text-gray-700 dark:text-gray-200">
      {actions.map((action, key) => (
        <li key={key}>
          <a
            href="#"
            onClick={(e) => {
              e.preventDefault();
              handleActionMenu(action.link);
            }}
            className={`block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white ${action.title === "Delete user" ? "border-t-2 border-grey-200 text-red-500" : ""}`}
          >
            {action.title}
          </a>
        </li>
      ))}
    </ul>
  );
};

export default ActionButton;

