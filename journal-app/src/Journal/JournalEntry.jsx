import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { deleteDoc, doc, getDoc } from 'firebase/firestore'
import db from '../db';

export default function JournalEntry() {
    const { id } = useParams();
    const nav = useNavigate();

    const [isLoading, setIsLoading] = useState(true);
    const [hasError, setHasError] = useState(false);
    const [entry, setEntry] = useState(undefined);

    // anytime {id} changes, want useEffect to show changes
    // we calling useEffect every time {id} changes
    useEffect(() => {
        const entryRef = doc(db, 'journal-entries', id)
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

    }, [id])

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
