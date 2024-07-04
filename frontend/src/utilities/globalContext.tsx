import {createContext , useState, FC, ReactNode, useEffect} from 'react'
import {Entry, EntryContextType} from '../@types/context'
import axios from 'axios'
import { lightTheme, darkTheme } from '../styles';

export const EntryContext = createContext<EntryContextType | null>(null);

export const EntryProvider: React.FC<{children : ReactNode}> = ({children}) => {
    const [entries, setEntries] = useState<Entry[]>([]);
    const [theme, setTheme] = useState<string>("light");

    const initState = async () => {
        const data = await axios.get<Entry[]>('http://localhost:3001/get/')
        const initialStateBody = data.data
        setEntries(initialStateBody)
    }

    useEffect(() => {
        initState()
        
        const storedTheme = localStorage.getItem("theme");
        if (storedTheme) {
          setTheme(storedTheme);
          const themeStyles = storedTheme === "light" ? lightTheme : darkTheme
          document.body.style.backgroundColor = themeStyles.rootBackground
        }
      }, []);

    const saveEntry = async (entry: Entry) => {
        const requestData = await axios.post<Entry>('http://localhost:3001/create/', entry)
        const newEntry = requestData.data
        setEntries([...entries, newEntry])
      }

    const updateEntry = async (id: string, entry: Entry) => {
        await axios.put<Entry>(`http://localhost:3001/update/${id}`, entry)
        setEntries(entries => {
          const entryIndex = entries.findIndex((obj => obj.id == id))
          entries[entryIndex] = entry
          console.log(entries)
          return entries
        })
    }
    const deleteEntry = async (id: string) => {
        await axios.delete<Entry>(`http://localhost:3001/delete/${id}`)
        setEntries(e => e.filter(entry => entry.id != id))
    }
    
    const toggleTheme = () => {
      const newTheme = theme === "light" ? "dark" : "light";
      setTheme(newTheme);
      localStorage.setItem("theme", newTheme);
      const themeStyles = newTheme === "light" ? lightTheme : darkTheme
      document.body.style.backgroundColor = themeStyles.rootBackground
    }
    
    return (
        <EntryContext.Provider value={{ entries, saveEntry, updateEntry, deleteEntry, theme, toggleTheme }}>
          {children}
        </EntryContext.Provider>
      )
}

