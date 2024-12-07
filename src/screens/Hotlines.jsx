import ButtonStyle from "../components/ReusableComponents/Button"
import HeadSide from "../components/ReusableComponents/HeaderSidebar"
import Toolbar from "../components/ToolBar"
import icons from "../assets/icons/Icons"
import Table from "../components/Table"
import Pagination from "../components/Pagination"

const Hotlines = () => {

    const HotlineHeaders = ["Image", "Name", "Phone Number", "Description", "Action"]

  return (
    <HeadSide 
        child={
          <>
               <Toolbar
                buttons={
                    <ButtonStyle 
                       icon={icons.addCircle}
                       color={"gray"}
                       label={"New hotlines"}
                       fontSize={"small"}
                    />
                }
                label="Hotlines Number"
                />
    
                <Table 
                    headers={HotlineHeaders}
                />
                <Pagination 
                    
                />
          </>
        }
    />
  )
}

export default Hotlines
