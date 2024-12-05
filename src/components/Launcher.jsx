import { useFetchSystemData } from '../hooks/useFetchSystemData';

const Luncher = () => {

  const {systemData} = useFetchSystemData();

  return (
      <img src={systemData?.imageUrl} className="h-24 w-24" />
  )
}

export default Luncher
