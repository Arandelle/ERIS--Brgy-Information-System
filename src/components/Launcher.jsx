import { useFetchSystemData } from '../hooks/useFetchSystemData';

const Luncher = () => {

  const {systemData} = useFetchSystemData();

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-100 dark:bg-gray-800">
      <img src={systemData?.imageUrl} alt="Loading..." loading='lazy' className="max-w-full max-h-full object-cover" />
  </div>
  )
}

export default Luncher
