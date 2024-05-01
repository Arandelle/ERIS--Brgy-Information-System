import ListRender from "./ListRender"

const List =() =>{
    const list = [
       {
        name: "Arandelle",
        age: 21
       },
       {
        name: "Paguinto",
        age: 16
       },
       {
        name: "Nazareno",
        age: 18
       }    
    ]
    return <ul>
        {
            list.map((stud,key)=>{
                return <ListRender key={key} name={stud.name} age={stud.age}/>
            })
        }
    </ul>
}
export default List