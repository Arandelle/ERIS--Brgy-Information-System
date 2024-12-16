import React from "react";
import Modal from "../../components/ReusableComponents/Modal";
import { formatDate } from "../../helper/FormatDate";

const ClearanceViewModal = ({ handleViewClick, userData = {} }) => {

    const {docsType, fullname, age, gender, address, civilStatus,moveInYear,date,status} = userData;
  const FetchDataStyle = ({label, data}) => {

    return (
      <div className="flex flex-row">
        <p className="flex-1 basis-1/3">{label} : </p>
        <p className="flex-1 basis-2/3 font-semibold">{data}</p>
      </div>
    );
  };

  return (
    <Modal
      closeButton={handleViewClick}
      title={"Certification Details"}
      children={
        <div className="min-w-[32rem] space-y-2">
          <FetchDataStyle label="Document Type" data={docsType} />
          <FetchDataStyle label={"Fullname"} data={fullname} />
          <FetchDataStyle label={"Age"} data={age} />
          <FetchDataStyle label={"Gender"} data={gender} />
          <FetchDataStyle label={"Address"} data={address} />
          <FetchDataStyle label={"Civil Status"} data={civilStatus} />
          <FetchDataStyle label={"Move-in Year"} data={moveInYear} />
          <FetchDataStyle label={"Date Requested"} data={formatDate(date)} />
          <FetchDataStyle label={"Status"} data={status} />
        </div>
      }
    />
  );
};

export default ClearanceViewModal;
