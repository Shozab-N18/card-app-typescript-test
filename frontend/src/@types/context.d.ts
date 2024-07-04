export interface Entry {
  id?: string;
  title: string;
  description: string;
  created_at: Date | string;
  scheduledDate: Date | string;
}
export type EntryContextType = {
  entries: Entry[];
  saveEntry: (entry: Entry) => void;
  updateEntry: (id: string, entryData: Entry) => void;
  deleteEntry: (id: string) => void;
  theme: string;
  toggleTheme: () => void
};
