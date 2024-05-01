/* import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <div>
        <a href="https://vitejs.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>Vite + React</h1>
      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
        <p>
          Edit <code>src/App.jsx</code> and save to test HMR
        </p>
      </div>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
        Arandelle Paguinto Testing
      </p>
    </>
  )
}

export default App */
import Header from "./components/Header"
import List from "./components/List"

const App = () => {
  const username = "Arandelle"
  const titleName = "Project Sample"
  const fncClick = () => {
    console.log("You've clicked Me!")
  }
  return <div className="container" id="" style={{
    fontSize: '24px',
    color: 'white',
    display: 'block'
  }}>
    <Header title={titleName} />
    <h1>Hello {username}!</h1>
    <button onClick={fncClick}>click Me! </button>
    <h3>List of Students Age 18 and above</h3>
    <List />
  </div>
}
export default App
