import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { deleteDoc, doc, getDoc } from 'firebase/firestore'
import db from '../db';
import firebase from 'firebase/compat/app';

export default function JournalEntry() {
    const { id } = useParams();
    const nav = useNavigate();

    const [isLoading, setIsLoading] = useState(true);
    const [hasError, setHasError] = useState(false);
    const [entry, setEntry] = useState([]);
    const [user, setUser] = useState({});

    useEffect(() => {
        const unregisteredAuthObserver = firebase.auth().onAuthStateChanged(user => {
            setUser(user)
        })

        return () => unregisteredAuthObserver(); // return this way if its a continuous check
                                                 // 
    }, [user.uid])


    // anytime {id} changes, want useEffect to show changes
    // we calling useEffect every time {id} changes
    useEffect(() => {
        // const userId = 'tEGimNXxSSjYFBL7NNek';
        // this is to check if user.uid exists before running
        // after uid is gotten from firebase, it will run or else it will do nothing useful
        if (!user.uid) {
            return;
        }

        const entryRef = doc(db, 'users', user.uid, 'journal-entries', id)
        getDoc(entryRef).then(docSnap => {
            setIsLoading(false);

            if (docSnap.exists()) {
                // console.log(docSnap.data())
                console.log("Document data:", docSnap.data());
                setEntry(docSnap.data());
            } else {
                // doc.data() will be undefined in this case
                console.log("No such document!");
                setHasError(true);
            }
        });

    }, [user.uid])

    if (isLoading) {
        <p>Loading...</p>
    }

    if (hasError) {
        <p>Has error</p>
    }

    const handleDelete = () => {
        deleteDoc(doc(db, 'journal-entries', id));
        alert('deleted');
        nav('/journal');
    }

    return (
        <div>
            <h1>Journal Entry: {id}</h1>
            {entry.entry}
        </div>
    );
}
