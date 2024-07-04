import {NavLink} from 'react-router-dom'
import React, { useState, useContext } from 'react'
import { EntryContext } from '../utilities/globalContext'
import { EntryContextType, Entry } from '../@types/context'
import { lightTheme, darkTheme } from '../styles'

export default function NavBar(){
  const { theme, toggleTheme } = useContext(EntryContext) as EntryContextType
  const [showSettingsDialog, setShowDialog] = useState(false)
  const themeStyles = theme === "light" ? lightTheme : darkTheme

  const toggleDialog = () => {
    setShowDialog(!showSettingsDialog)
  }
  
    return(
      <nav className="flex justify-center gap-5">
        <NavLink className={`m-3 p-4 text-xl ${themeStyles.link} ${themeStyles.linkHover} rounded-md font-medium ${themeStyles.text}`} to={'/'}>All Entries</NavLink>
        <NavLink className={`m-3 p-4 text-xl ${themeStyles.link} ${themeStyles.linkHover} rounded-md font-medium ${themeStyles.text}`} to={'/create'}>New Entry</NavLink>
        <button  className={`m-3 p-4 text-xl ${themeStyles.link} ${themeStyles.linkHover} rounded-md font-medium ${themeStyles.text}`} onClick={toggleDialog}>Settings</button>
        {showSettingsDialog && (
          <div className={`absolute right-0 mt-2 ${themeStyles.box} rounded-md shadow-lg`}>
            <ul className="py-1">
              <li className={`px-4 py-2 ${themeStyles.text} ${themeStyles.linkHover} cursor-pointer`} onClick={toggleTheme}>Toggle Theme</li>
              <li className={`px-4 py-2 ${themeStyles.text} ${themeStyles.linkHover} cursor-pointer`} onClick={toggleDialog}>Close</li>
            </ul>
          </div>
        )}
      </nav>
    )
}