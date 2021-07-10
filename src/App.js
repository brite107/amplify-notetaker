import { useState } from 'react';
import { withAuthenticator, AmplifySignOut } from '@aws-amplify/ui-react';
import { API, graphqlOperation  } from 'aws-amplify';
import { createNote } from './graphql/mutations'

const App = () => {
  const [state, setState] = useState({
    note: "",
    notes: []
  });

  const handleChangeNote = event => {
    console.log(event);
    setState({note: event.target.value})
  };

  const handleAddNote = event => {
    console.log(event);
    const { note } = state;
    event.preventDefault();
    const input = { note };
    API.graphql(graphqlOperation(createNote, { input }));
  }

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
        />
        <button 
          className="pa2 f4"
          type="submit">
          Add note
        </button>
      </form>
      {/* Notes List */}
      <div>
        {state.notes && state.notes.map(item => (
          <div key={item.id} className="flex items-center">
            <li className="list pa1 f3">
              {item.note}
            </li>
            <button className="bg-transparent bn f4"><span>&times;</span></button>
          </div>
        ))}
      </div>
      <AmplifySignOut />
    </div>
  );
}

export default withAuthenticator(App);
