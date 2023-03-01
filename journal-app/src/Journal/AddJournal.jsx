import { useState, useEffect } from "react"
import { collection, addDoc } from "firebase/firestore";
import db from '../db';
import firebase from "firebase/compat/app";

function AddJournal() {
  const [entry, setEntry] = useState('');
  const [user, setUser] = useState({});

  useEffect(() => {
      const unregisteredAuthObserver = firebase.auth().onAuthStateChanged(user => {
          setUser(user)
      })

      return () => unregisteredAuthObserver(); // return this way if its a continuous check
                                               // 
  }, [user.uid])

  const submitForm = (e) => {
    e.preventDefault();
    console.log('submitForm succeeded');

    // const userId = 'tEGimNXxSSjYFBL7NNek';

    // Add a new document with a generated id.
    const entriesRef = collection(db, 'users', user.uid, 'journal-entries');
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
