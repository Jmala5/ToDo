import { useState, useEffect } from 'react';
import axios from 'axios';

function Notes() {
    const [note, setNote] = useState(null); // Store a single note
    const [text, setText] = useState('');
    const [isEditing, setIsEditing] = useState(false);

    // Fetch the note for the user
    useEffect(() => {
        // Reset state when component mounts
        setNote(null);
        setText('');
        setIsEditing(false);

        axios.get('http://localhost:5000/notes', {
            headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        })
            .then(response => {
                if (response.data.length > 0) {
                    setNote(response.data[0]); // Load the single note
                    setText(response.data[0].text);
                }
            })
            .catch(err => console.error(err));
    }, []); // Empty dependency array ensures this runs only on mount.

    // Add or update the note
    const saveNote = () => {
        if (!text.trim()) return;

        if (note) {
            axios.put(`http://localhost:5000/notes/${note._id}`, { text }, {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
            })
                .then(response => {
                    setNote(response.data);
                    setIsEditing(false);
                })
                .catch(err => console.error(err));
        } else {
            axios.post('http://localhost:5000/notes', { text }, {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
            })
                .then(response => setNote(response.data))
                .catch(err => console.error(err));
        }
    };

    // Delete the note
    const deleteNote = () => {
        if (note) {
            axios.delete(`http://localhost:5000/notes/${note._id}`, {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
            })
                .then(() => {
                    setNote(null);
                    setText('');
                    setIsEditing(false);
                })
                .catch(err => console.error(err));
        }
    };

    // Navigate to the previous page
    const navigateToNavigation = () => {
        window.location.href = '/Dashboard'; // Replace with your actual navigation route
    };

    return (
        <div style={styles.container}>
            <div style={styles.backgroundImage} />
            <div style={styles.notesContainer}>
                <div style={styles.header}>NOTES</div>
                {note ? (
                    <div>
                        {isEditing ? (
                            <div style={styles.editContainer}>
                                <textarea
                                    value={text}
                                    onChange={(e) => setText(e.target.value)}
                                    style={styles.textArea}
                                />
                                <div style={styles.buttonGroup}>
                                    <button onClick={saveNote} style={styles.button}>Save</button>
                                    <button onClick={() => setIsEditing(false)} style={styles.button}>Cancel</button>
                                </div>
                            </div>
                        ) : (
                            <div style={styles.noteDisplay}>
                                <div style={styles.scrollableText}>
                                    <p style={styles.noteText}>{note.text}</p>
                                </div>
                            </div>
                        )}
                    </div>
                ) : (
                    <div style={styles.editContainer}>
                        <textarea
                            value={text}
                            onChange={(e) => setText(e.target.value)}
                            placeholder="Write your note here"
                            style={styles.textArea}
                        />
                        <div style={styles.buttonGroup}>
                            <button onClick={saveNote} style={styles.button}>Add Note</button>
                        </div>
                    </div>
                )}
            </div>
            {note && !isEditing && (
                <div style={styles.controlButtons}>
                    <button onClick={() => setIsEditing(true)} style={styles.button}>Edit</button>
                    <button onClick={deleteNote} style={styles.button}>Delete</button>
                </div>
            )}
            <div style={styles.navigation}>
                <button onClick={navigateToNavigation} style={styles.navButton}>
             
                 🠄
      
                </button>
            </div>
        </div>
    );
}

const styles = {
    container: {
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100vh',
        width: '100vw',
        overflow: 'hidden',
        fontFamily: `'Acme', sans-serif`, // Default font
    },
    backgroundImage: {
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        backgroundImage: 'url(https://images.unsplash.com/photo-1734613414358-66038a779fed?q=80&w=1932&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        filter: 'blur(5px)', // Adjust blur intensity
        zIndex: -1, // Keep background behind content
    },
    notesContainer: {
        width: '90%',
        maxWidth: '900px',
        height: '80%',
        backgroundColor: '#E4C9B6',
        borderRadius: '12px',
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
        display: 'flex',
        flexDirection: 'column',
        padding: '20px',
        overflow: 'hidden',
        fontFamily: `'Cormorant', serif`, // Specific font
    },
    header: {
        backgroundColor: '#D7A49A',
        color: '#FFF',
        textAlign: 'center',
        fontWeight: 'bold',
        fontSize: '24px',
        padding: '15px',
        marginBottom: '10px',
        fontFamily: `'Shadows Into Light', cursive`, // Specific font
    },
    editContainer: {
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
    },
    textArea: {
        flex: 1,
        width: '96.5%',
        padding: '15px',
        borderRadius: '8px',
        border: '1px solid #A4B1BA',
        fontSize: '18px',
        backgroundColor: '#A4B1BA',
        color: '#FFF',
        resize: 'none',
        overflowY: 'auto',
        marginBottom: '10px',
        fontFamily: `'Cormorant', serif`, // Specific font
    },
    noteDisplay: {
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        overflow: 'hidden',
        padding: '10px',
        fontFamily: `'Cormorant', serif`, // Specific font
    },
    scrollableText: {
        flex: 1,
        overflowY: 'auto',
        maxHeight: '400px',
        padding: '10px',
    },
    noteText: {
        fontSize: '18px',
        color: '#333',
        whiteSpace: 'pre-wrap',
        fontFamily: `'Shadows Into Light', cursive`, // Specific font
    },
    buttonGroup: {
        display: 'flex',
        justifyContent: 'space-between',
        gap: '10px',
    },
    button: {
        backgroundColor: '#D7A49A',
        color: '#FFF',
        padding: '12px 20px',
        border: 'none',
        borderRadius: '8px',
        fontWeight: 'bold',
        cursor: 'pointer',
        fontSize: '16px',
        fontFamily: `'Acme', sans-serif`, // Specific font
    },
    controlButtons: {
        marginTop: '10px',
        display: 'flex',
        justifyContent: 'center',
        gap: '10px',
    },
    navigation: {
        position: 'absolute',
        bottom: '20px',
        left: '20px',
    },
    navButton: {
        backgroundColor: '#A4B1BA',
        color: '#FFF',
        padding: '12px 20px',
        border: 'none',
        borderRadius: '50%', // Makes the button round
        cursor: 'pointer',
        fontWeight: 'bold',
        fontSize: '16px',
        fontFamily: `'Acme', sans-serif`, // Specific font
    },
};

export default Notes;
