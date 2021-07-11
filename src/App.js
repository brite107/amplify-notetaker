import { useState, useEffect } from 'react';
import { withAuthenticator, AmplifySignOut } from '@aws-amplify/ui-react';
import { API, graphqlOperation  } from 'aws-amplify';
import { createNote, deleteNote } from './graphql/mutations';
import { listNotes } from './graphql/queries';

const App = () => {
  const [note, setNote] = useState('');
  const [notes, setNotes] = useState([]);
  // const [noteState, setNoteState] = useState({
  //   note: "",
  //   notes: [],
  // });

  useEffect(() => {
    const getNotes = async () => {
      const result = await API.graphql(graphqlOperation(listNotes));
      const savedNotes = result.data.listNotes.items;
      setNotes(savedNotes);
    }

    getNotes();
    
  }, [])

  const handleChangeNote = event => {
    setNote(event.target.value);
  };

  const handleAddNote = async event => {
    event.preventDefault();
    const input = { note };
    const result = await API.graphql(graphqlOperation(createNote, { input }));
    const newNote = result.data.createNote;
    setNotes([newNote, ...notes]);
    setNote('');
  };

  const handleDeleteNote = async noteId => {
    const input = { id: noteId };
    const result = await API.graphql(graphqlOperation(deleteNote, { input }));
    const deletedNoteId = result.data.deleteNote.id;
    const updatedNotes = notes.filter(note => note.id !== deletedNoteId);
    setNotes(updatedNotes);
  };

  return (
    <div className="flex flex-column items-center justify-center pa3 bg-washed-red">
      <h1 className="code f2-1">Amplify Notetaker</h1>
      {/* Note Form */}
      <form onSubmit={handleAddNote} className="mb3">
        <input 
          type="text" 
          className="pa2 f4"
          placeholder="Write your note"
          onChange={handleChangeNote}
          value={note} 
        />
        <button 
          className="pa2 f4"
          type="submit"
        >
          Add note
        </button>
      </form>
      {/* Notes List */}
      <div>
        {notes && notes.map(item => (
          <div key={item.id} className="flex items-center">
            <li className="list pa1 f3">
              {item.note}
            </li>
            <button onClick={() => handleDeleteNote(item.id)} className="bg-transparent bn f4"><span>&times;</span></button>
          </div>
        ))}
      </div>
      <AmplifySignOut />
    </div>
  );
}

export default withAuthenticator(App);
