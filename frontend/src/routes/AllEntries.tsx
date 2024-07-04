import {useContext} from 'react'
import { EntryContext } from '../utilities/globalContext'
import { EntryContextType, Entry } from '../@types/context'
import { useNavigate, Link } from "react-router-dom"
import { lightTheme, darkTheme } from '../styles'

export default function AllEntries(){
    const { entries, deleteEntry, theme } = useContext(EntryContext) as EntryContextType
    const themeStyles = theme === "light" ? lightTheme : darkTheme
    let navigate = useNavigate();
    if(entries.length == 0){
        return(
            <section>
                <h1 className={`text-center font-semibold ${themeStyles.text} text-2xl m-5`}>You don't have any card</h1>
                <p className={`text-center font-medium ${themeStyles.text} text-md`}>Lets <Link className={`${themeStyles.textLink} underline underline-offset-1`} to="/create">Create One</Link></p>
            </section>
        )
    }
    return(
        <section className="grid grid-cols-2 md:grid-cols-4">
            {entries.map((entry: Entry, index: number) => {
                return(
                    <div id={entry.id} key={index} className={`${themeStyles.box} shadow-md shadow-gray-500 m-3 p-4 rounded flex flex-col justify-between`}>
                        <h1 className={`font-bold text-sm md:text-lg ${themeStyles.text}`}>{entry.title}</h1>
                        <p className={`text-center text-lg font-light md:mt-2 md:mb-4 mt-1 mb-3 ${themeStyles.text}`}>{entry.description}</p>
                        <time className={`text-center text-sm md:text-lg ${themeStyles.text}`}>Scheduled for: {new Date(entry.scheduledDate.toString()).toLocaleDateString()}</time>
                        <section className="flex items-center justify-between flex-col md:flex-row pt-2 md:pt-0">
                        <div className="flex justify-center">
                                <button onClick={() => { deleteEntry(entry.id as string) }} className={`m-1 md:m-2 p-1 font-semibold rounded-md ${themeStyles.redButton} ${themeStyles.redButtonHover}`}>✖</button>
                                <button onClick={() => { navigate(`/edit/${entry.id}`, { replace: true }); }} className={`m-1 md:m-2 p-1 font-semibold rounded-md ${themeStyles.link} ${themeStyles.linkHover}`}>🖊</button>
                        </div>
                        <time className={`text-right text-sm md:text-lg ${themeStyles.text}`}>{new Date(entry.created_at.toString()).toLocaleDateString()}</time>
                        </section>
                        
                    </div>
                )
            })}
        </section>
    )
}