import React from "react";
import { toast } from "sonner";

const AddUserModal = ({ addUser, setAddUser, next, setNext }) => {
  return (
    <div>
      {addUser && (
        <div className="flex items-center justify-center absolute inset-0 z-50">
          <div
            className="absolute h-full w-full bg-gray-600 bg-opacity-50"
            onClick={() => setAddUser(false)}
          ></div>
          <div className="relative p-10 bg-white rounded-md shadow-md">
            <button
              className="absolute top-2 right-2"
              onClick={() => setAddUser(false)}
            >
              Close
            </button>
            <div className="flex flex-col space-y-1">
              <h2>Add user</h2>
              <input type="text" placeholder="enter firstname" required />
              <input type="text" placeholder="enter middlename" required  />
              <input type="text" placeholder="enter lastname" required />
              <button
                className="p-2 text-gray-200 bg-primary-500"
                onClick={() => {
                  setNext(true);
                  setAddUser(false);
                }}
              >
                Next
              </button>
            </div>
          </div>
        </div>
      )}{" "}
      {next && (
        <div className="flex items-center justify-center absolute inset-0 z-50">
          <div
            className="absolute h-full w-full bg-gray-600 bg-opacity-50"
            onClick={() => setNext(false)}
          ></div>
          <div className="relative p-10 bg-white rounded-md shadow-md">
            <button
              className="absolute top-2 right-2"
              onClick={() => setNext(false)}
            >
              Close
            </button>
            <div className="flex flex-col space-y-1">
              <h2>Add user</h2>
              <input type="text" placeholder="enter gender" required />
              <input type="text" placeholder="enter age" required />
              <input type="text" placeholder="enter bday" required />
              <div className="flex flex-row space-x-1 justify-between">
                <button
                  className="p-2 text-gray-200 bg-primary-500"
                  onClick={() => {
                    setAddUser(true);
                    setNext(false);
                  }}
                >
                  back
                </button>
                <button
                  className="p-2 text-gray-200 bg-primary-500"
                  onClick={() => {
                    setNext(false, toast.success("User Added successfully"));
                  }}
                >
                  Submit
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AddUserModal;
