import { useState } from 'react'
import React from 'react'
import Header from "./components/Header"
import List from "./components/List"
import './index.css'

const App = () => {
  const username = "Arandelle"
  const titleName = "Project Sample"
  const fncClick = () => {
    console.log("You've clicked Me!")
  }
  return <div>
    <Header />
    <h1 className="text-xl font-bold text-red-500 ">Hello {username}!</h1>
    <button onClick={fncClick}>click Me! </button>
    <h3>List of Students Age 18 and above</h3>
    <List />
  </div>
}
export default App
