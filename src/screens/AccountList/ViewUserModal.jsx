import icons from "../../assets/icons/Icons";
import Modal from "../../components/ReusableComponents/Modal";
const ViewUserModal = ({ setViewUser, userToViewInfo }) => {
  return (
    <Modal
      closeButton={() => setViewUser(!true)}
      children={
        <>
          <div className="flex flex-col justify-between space-y-2">
            <p className="flex items-center justify-center p-2">
              <img
                src={userToViewInfo.img}
                alt="Profile"
                className="h-24 w-24 rounded-full"
              />
            </p>
            <div className="flex flex-col space-y-2">
              <div className="space-y-2">
                <p className="flex flex-row items-center justify-center space-x-2 font-bold text-gray-500 text-lg border-b-2 border-b-gray-300">
                  <p>
                    {userToViewInfo?.firstname && userToViewInfo?.lastname
                      ? `${userToViewInfo.firstname} ${userToViewInfo.lastname}`
                      : "Anonymous"}
                  </p>
                  {userToViewInfo.gender === "male" ? (
                    <icons.male className="text-gray-500" />
                  ) : (
                    <icons.female className="text-gray-500" />
                  )}
                </p>
                <div className="text-center text-gray-500 flex flex-row justify-evenly">
                  <p className="italic text-gray-900">
                    {userToViewInfo.email}{" "}
                  </p>
                  <p className="italic text-gray-900">
                    {userToViewInfo.mobileNum
                      ? userToViewInfo.mobileNum
                      : "mobile number"}
                  </p>
                </div>
                <p className="text-center flex flex-row justify-evenly bg-gray-200 p-2 text-sm text-gray-900 font-thin lowercase italic">
                  <p className="font-bold">user id:</p>{" "}
                  {userToViewInfo.customId}
                </p>

                <div className="bg-gray-100 p-4 rounded-sm">
                  <p className="text-gray-900 text-lg">
                    {userToViewInfo.address}
                  </p>

                  <p className="text-gray-900 text-lg">
                    {userToViewInfo?.age
                      ? `${userToViewInfo.age} years old`
                      : "user details"}
                  </p>
                </div>
              </div>
              <p className="text-center text-lg uppercase">
                {userToViewInfo?.profileComplete ? (
                  <p className="text-green-500 font-bold bg-green-100 p-2">
                    completed
                  </p>
                ) : (
                  <p className="text-red-500 font-bold bg-red-100">
                    not completed
                  </p>
                )}
              </p>
            </div>
            <button
              className="p-2 text-gray-200 bg-primary-500"
              onClick={() => {
                setViewUser(false);
              }}
            >
              OK
            </button>
          </div>
        </>
      }
    />
  );
};

export default ViewUserModal;
