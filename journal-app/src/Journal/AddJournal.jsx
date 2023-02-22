import { useState } from "react"
import { collection, addDoc } from "firebase/firestore";
import db from '../db';

function AddJournal() {
  const [entry, setEntry] = useState('');

  const submitForm = (e) => {
    e.preventDefault();
    console.log('submitForm succeeded');

    // Add a new document with a generated id.
    const entriesRef = collection(db, 'journal-entries');
    addDoc(entriesRef, {
      entry, // same as -> entry: entry (this is a js thing)
      createdAt: new Date()
    }).then(setEntry(''));

  }

  return (
    <div>
      <h2>Add Journal Entry</h2>
      <form onSubmit={submitForm}>
        <label htmlFor="entry-input">Entry:</label>
        <textarea  id="entry-input" onChange={e => setEntry(e.target.value)} value={entry}/>
        <button type="submit">Submit</button>
      </form>
    </div>
  )
}
export default AddJournal
