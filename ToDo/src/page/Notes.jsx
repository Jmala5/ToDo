import { useState, useEffect } from 'react';
import axios from 'axios';

function Notes() {
    const [note, setNote] = useState(null); // Store a single note
    const [text, setText] = useState('');
    const [isEditing, setIsEditing] = useState(false);

    // Fetch the note for the user
    useEffect(() => {
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
    }, []);

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
    const navigateBack = () => {
        window.history.back();
    };

    return (
        <div style={styles.container}>
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
                <button onClick={navigateBack} style={styles.navButton}>Previous Page</button>
            </div>
        </div>
    );
}

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100vh',
    width: '100vw',
    backgroundColor: '#E1DAD3',
  },
  notesContainer: {
    width: '90%',
    maxWidth: '900px',
    height: '80%', // Occupy most of the screen height
    backgroundColor: '#E4C9B6',
    borderRadius: '12px',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
    display: 'flex',
    flexDirection: 'column',
    padding: '20px', // Add padding for proper spacing
    overflow: 'hidden', // Ensure no overflowing outside
  },
  header: {
    backgroundColor: '#D7A49A',
    color: '#FFF',
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: '24px',
    padding: '15px',
    marginBottom: '10px', // Add space below header
  },
  editContainer: {
    flex: 1, // Take remaining space
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
  },
  textArea: {
    flex: 1, // Occupy remaining vertical space
    width: '96.5%',
    padding: '15px',
    borderRadius: '8px',
    border: '1px solid #A4B1BA',
    fontSize: '18px',
    backgroundColor: '#A4B1BA', // Use one of the suggested colors
    color: '#FFF',
    resize: 'none', // Disable resizing
    overflowY: 'auto', // Add scroll for long text
    marginBottom: '10px', // Space between textarea and buttons
  },
  noteDisplay: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    overflow: 'hidden', // Hide overflowing content
    padding: '10px',
  },
  scrollableText: {
    flex: 1,
    overflowY: 'auto', // Scroll for long text
    maxHeight: '400px', // Constrain height for scrolling
    padding: '10px',
  },
  noteText: {
    fontSize: '18px',
    color: '#333',
    whiteSpace: 'pre-wrap', // Preserve line breaks
  },
  buttonGroup: {
    display: 'flex',
    justifyContent: 'space-between', // Spread buttons apart
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
  },
  controlButtons: {
    marginTop: '10px',
    display: 'flex',
    justifyContent: 'center',
    gap: '10px',
  },
  navigation: {
    marginTop: '20px',
    display: 'flex',
    justifyContent: 'center',
  },
  navButton: {
    backgroundColor: '#A4B1BA',
    color: '#FFF',
    padding: '10px 20px',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    fontWeight: 'bold',
    fontSize: '16px',
  },
};

export default Notes;
