import {useState, useContext, ChangeEvent, MouseEvent} from 'react'
import {EntryContext} from '../utilities/globalContext'
import { Entry, EntryContextType } from '../@types/context'
import { lightTheme, darkTheme } from '../styles'

export default function NewEntry(){
    const emptyEntry: Entry = {title: "", description: "",created_at: new Date(), scheduledDate: new Date()}
    const { saveEntry, theme } = useContext(EntryContext) as EntryContextType
    const themeStyles = theme === "light" ? lightTheme : darkTheme
    const calendarIconTheme = theme === "light" ? "light" : "dark"
    const [newEntry,setNewEntry] = useState<Entry>(emptyEntry)
    const handleInputChange = (event: ChangeEvent<HTMLInputElement|HTMLTextAreaElement>) => {
        setNewEntry({
            ...newEntry,
            [event.target.name] : event.target.value
        })
    }
    const handleSend = (e: MouseEvent<HTMLButtonElement>) => {
        saveEntry(newEntry)
        setNewEntry(emptyEntry)
    }
    return(
        <section className={`flex justify-center flex-col w-fit ml-auto mr-auto mt-10 gap-5 ${themeStyles.box} p-8 rounded-md`}>
            <input className={`p-3 rounded-md ${themeStyles.background} ${themeStyles.text}`} type="text" placeholder="Title" name="title" value={newEntry.title} onChange={handleInputChange}/>
            <textarea className={`p-3 rounded-md ${themeStyles.background} ${themeStyles.text}`} placeholder="Description" name="description" value={newEntry.description} onChange={handleInputChange}/>
            <input style={{ colorScheme: calendarIconTheme}} className={`p-3 rounded-md ${themeStyles.background} ${themeStyles.text}`} type="date" name="created_at" value={(new Date(newEntry.created_at)).toISOString().split('T')[0]} onChange={handleInputChange} />
            <input style={{ colorScheme: calendarIconTheme}} className={`p-3 rounded-md ${themeStyles.background} ${themeStyles.text}`} type="date" name="scheduledDate" value={(new Date(newEntry.scheduledDate)).toISOString().split('T')[0]} onChange={handleInputChange}/>
            <button onClick={(e) => {handleSend(e)}} className={`${themeStyles.link} ${themeStyles.linkHover} font-semibold text-white p-3 rounded-md`}>Create</button>
        </section>
    )
}