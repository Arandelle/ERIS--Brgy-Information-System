import React from "react";
import { toast } from "sonner";
import InputReusable from "../../ReusableComponents/InputReusable";

const AddUserModal = ({ addUser, setAddUser, next, setNext }) => {
  return (
    <div>
      {addUser && (
        <div className="flex items-center justify-center fixed inset-0 z-50">
          <div
            className="absolute h-full w-full bg-gray-600 bg-opacity-50"
            onClick={() => setAddUser(false)}
          ></div>
          <div className="relative p-10 bg-white rounded-md shadow-md">
          <h2>Add user</h2>
            <button
              className="absolute top-2 right-2"
              onClick={() => setAddUser(false)}
            >
              Close
            </button>
            <div className="flex flex-col space-y-2">
              <h1>Personal Information</h1>
              <InputReusable className={"border"} placeholder={"Enter Firstname"} />
              <InputReusable className={"border"} placeholder={"Enter Middlename"} />
              <InputReusable className={"border"} placeholder={"Enter Lastname"}/>
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
        <div className="flex items-center justify-center fixed inset-0 z-50">
          <div
            className="fixed h-full w-full bg-gray-600 bg-opacity-50"
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
              <InputReusable type={"number"} className={"border"} placeholder={"Enter Age"} />
              <InputReusable type={"text"} className={"border"} placeholder={"Enter Address"} />
              <InputReusable type={"text"} onFocus={(e)=> (e.target.type = "date" )} className={"border"} placeholder={"Enter Bday"}/>
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
