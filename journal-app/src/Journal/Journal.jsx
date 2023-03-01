import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { collection, getDocs, onSnapshot, orderBy, query, doc, deleteDoc } from "firebase/firestore";
import db from '../db';
import AddJournal from './AddJournal';
import firebase from 'firebase/compat/app';

export default function Journal() {
    const [entries, setEntries] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [hasError, setHasError] = useState(false);
    const [user, setUser] = useState({});

    useEffect(() => {
        const unregisteredAuthObserver = firebase.auth().onAuthStateChanged(user => {
            console.log(user);
            setUser(user)
        })

        return () => unregisteredAuthObserver(); // return this way if its a continuous check
                                                 // 
    }, [user.uid])

    useEffect(() => {
        if (!user.uid) {
            return;
        }
        
        // const userId = 'tEGimNXxSSjYFBL7NNek';
        const entriesQuery = query(
            // collection(db, 'journal-entries'),
            // collection(db, `users/${userId}/journal-entries`),
            collection(db, 'users', user.uid, 'journal-entries'),
            orderBy('createdAt', 'desc')
        )
        // important: the docs have a certain way of wanting you to do things
        // onSnapshot and getDocs do similar things
        // const unsubscribe = onSnapshot(collection(db, 'journal-entries'), 
        const unsubscribe = onSnapshot(
            entriesQuery, 
            snapshot => {
                // snapshot.forEach(doc => {
                //     console.log(doc.data());
                // });
                setEntries(snapshot.docs);
                setIsLoading(false);
            },
            error => {
                console.log(error);
                setIsLoading(false);
                setHasError(false);
            }
        );
            return () => unsubscribe(); // this is unmount the component and is necessary to avoid 
    }, [user.uid])

    if (isLoading) {
        <p>Loading...</p>
    }

    if (hasError) {
        <p>Has error</p>
    }

    
    const deleteEntry = (id) => {
        deleteDoc(doc(db, 'journal-entries', id));
    }

    const deleteItem = (id) => {
        console.log(`deleting`);
        deleteDoc(doc);
    }

    return (
        <div>
            <h1>Journal</h1>
            <AddJournal />
            {entries.map((entry) => {
                return (
                    <div key={entry.id}>
                        <p>
                            {entry.data().entry}
                            <span><Link to={`/journal/${entry.id}`}>View</Link></span>
                            <button onClick={() => deleteEntry(entry.id)}>Delete</button>
                        </p>
                    </div>
                )
            })}
        </div>
    );
}
