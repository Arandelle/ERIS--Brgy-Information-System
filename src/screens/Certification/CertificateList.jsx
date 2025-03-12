import React from 'react'
import EmptyLogo from '../../components/ReusableComponents/EmptyLogo';
import icons from '../../assets/icons/Icons';
import { useNavigate } from 'react-router-dom';

const CertificateList = ({pending}) => {
  
  const navigate = useNavigate();

  return (
    <div className="bg-white w-full h-full rounded-md border-t-4 border-t-blue-500 dark:border-t-blue-400 shadow-md dark:bg-gray-800">
    <p className="text-center p-2 dark:text-gray-400">Request Documents</p>
    {pending.length === 0 ? (
      <EmptyLogo message={"No request documents"}/>
    ) : (
      pending
        ?.map((data, index) => (
          <ul key={index} className="space-y-2">
            <li className="flex flex-row items-center justify-between p-2 cursor-pointer bg-gray-100 dark:bg-gray-800 hover:bg-gray-200"
            onClick={() => navigate("/certification")}>
              <div className="flex flex-col">
                <p className="font-bold dark:text-gray-400"> {data.fullname}</p>
                <p className="text-sm text-gray-500 ">
                  {" "}
                  {data.docsType}
                </p>
              </div>
              <icons.arrowRight className="dark:text-gray-500" />
            </li>
          </ul>
        ))
        .slice(0, 10)
    )}
    <div>
</div>
  </div>
  )
}

export default CertificateList
