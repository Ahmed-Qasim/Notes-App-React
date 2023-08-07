import Editor from "./Components/Editor";
import SideBar from "./Components/SideBar";
// import { nanoid } from "nanoid";
import Split from "react-split";
import { addDoc, onSnapshot, doc, deleteDoc, setDoc } from "firebase/firestore";
import { noteCollection, db } from "./Firebase";
import "./App.css";

import { useEffect, useState } from "react";

function App() {
    // **working with firebase**

    const [notes, setNotes] = useState([]);

    const [currentNoteId, setCurrentNoteId] = useState("");

    const [tempNoteText, setTempNoteText] = useState("");

    const [isLoading, setIsLoading] = useState(true);

    const currentNote =
        notes.find((note) => {
            return note.id === currentNoteId;
        }) || notes[0];

    const sortedNotes = notes.sort((a, b) => b.updatedAt - a.updatedAt);

    useEffect(() => {
        const unsubscribe = onSnapshot(noteCollection, (snapshot) => {
            const newArr = snapshot.docs.map((doc) => ({
                ...doc.data(),
                id: doc.id,
            }));
            setNotes(newArr);
            setIsLoading(false);
        });
        return unsubscribe;
    }, []);

    useEffect(() => {
        if (!currentNoteId) {
            setCurrentNoteId(notes[0]?.id);
        }
    }, [notes]);

    useEffect(() => {
        if (currentNote) setTempNoteText(currentNote.body);
    }, [currentNote]);

    useEffect(() => {
        const timeoutId = setTimeout(() => {
            if (tempNoteText !== currentNote.body) {
                updateNote(tempNoteText)
            }
        }, 500);
        return () => clearTimeout(timeoutId);
    }, [tempNoteText]);

    async function createNewNote() {
        const newNote = {
            body: "Type your note here",
            createdAt: Date.now(),
            updatedAt: Date.now(),
        };
        const noteRef = await addDoc(noteCollection, newNote);

        setCurrentNoteId(noteRef.id);
    }

    async function updateNote(text) {
        const docRef = doc(db, "notes", currentNoteId);
        await setDoc(
            docRef,
            { body: text, updatedAt: Date.now() },
            { merge: true }
        );
    }

    async function deleteNotes(noteId) {
        const noteRef = doc(db, "notes", noteId);
        await deleteDoc(noteRef);
    }

    // **working with local storage**

    // const [notes, setNotes] = useState(
    //     () => JSON.parse(localStorage.getItem("notes")) || []
    // );

    // const [currentNoteId, setCurrentNoteId] = useState(notes[0]?.id || "");

    // const currentNote =
    //     notes.find((note) => {
    //         return note.id === currentNoteId;
    //     }) || notes[0];

    // useEffect(() => {
    //     localStorage.setItem("notes", JSON.stringify(notes));
    // }, [notes]);

    // function createNewNote() {
    //     const newNote = {
    //         id: nanoid(),
    //         body: "Type your note here",
    //     };
    //     setNotes((prevNotes) => [newNote, ...prevNotes]);
    //     setCurrentNoteId(newNote.id);
    // }

    // function updateNote(text) {
    //     setNotes((oldNotes) => {
    //         const newArray = [];
    //         for (let i = 0; i < oldNotes.length; i++) {
    //             const oldNote = oldNotes[i];
    //             if (oldNote.id === currentNoteId) {
    //                 newArray.unshift({ ...oldNote, body: text });
    //             } else {
    //                 newArray.push(oldNote);
    //             }
    //         }
    //         return newArray;
    //     });
    // }

    // function deleteNotes(event, noteId) {
    //     event.stopPropagation();
    //     setNotes((prevNotes) => prevNotes.filter((note) => note.id !== noteId));
    // }

    return (
        <main className="main">
            {isLoading ? (
                <div className="loading-container  ">
                    <div className="spinner"></div>.
                </div>
            ) : notes.length > 0 ? (
                <Split
                    sizes={[30, 70]}
                    direction="horizontal"
                    className="split"
                    expandToMin={true}
                >
                    <SideBar
                        newNote={createNewNote}
                        notes={sortedNotes}
                        currentNote={currentNote}
                        setCurrentNoteId={setCurrentNoteId}
                        delete={deleteNotes}
                    ></SideBar>
                    <Editor
                        tempNote={tempNoteText}
                        setTempNote={setTempNoteText}
                    ></Editor>
                </Split>
            ) : (
                <div className="no-notes">
                    <h1>You have no notes</h1>
                    <button className="first-note" onClick={createNewNote}>
                        Create one now
                    </button>
                </div>
            )}
        </main>
    );
}

export default App;
