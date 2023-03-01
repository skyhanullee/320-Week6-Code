import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import firebase from 'firebase/compat/app';

export default function Nav() {
    const navigate = useNavigate();
    const [user, setUser] = useState({});

    useEffect(() => {
        const unregisteredAuthObserver = firebase.auth().onAuthStateChanged(user => {
            setUser(user)
        })

        return () => unregisteredAuthObserver(); // return this way if its a continuous check
                                                 // 
    }, [])

    return (
        <div>
            <ul>
                <li><Link to="/">Home</Link></li>
                <li><Link to="/journal">Journal</Link></li>
                <li><Link to="/journal/1">Journal Entry</Link></li>
                {/* check if user exists/signed in */}
                {/* user && is checking user is true */}
                {user && <div>
                    {user.displayName} 
                    <img src={user.photoURL} alt={user.displayName} />
                    <button onClick={() => {
                            firebase.auth().signOut();
                            navigate('/');
                        }}>Sign Out</button>
                    </div>
                }

            </ul>
        </div>
    );
}
