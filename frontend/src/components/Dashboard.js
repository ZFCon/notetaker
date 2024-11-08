import React, { useEffect, useState, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Button, Table, TableHead, TableBody, TableRow, TableCell, TableContainer, Paper, Dialog, DialogActions, DialogContent, DialogTitle, TextField } from '@mui/material';
import { fetchNotes, createNote, updateNote, deleteNote } from '../store/notesSlice';

const Dashboard = () => {
    const dispatch = useDispatch();
    const { notes, loading, error } = useSelector((state) => state.notes);
    const { token } = useSelector((state) => state.auth);

    // Local state for the dialog form
    const [open, setOpen] = useState(false);
    const [noteData, setNoteData] = useState({ title: '', description: '', audio: null });
    const [editingNote, setEditingNote] = useState(null);

    // Audio recording state
    const [isRecording, setIsRecording] = useState(false);
    const [audioURL, setAudioURL] = useState(null);
    const mediaRecorderRef = useRef(null);
    const audioChunksRef = useRef([]);
    const audioStreamRef = useRef(null);

    useEffect(() => {
        dispatch(fetchNotes());
    }, [dispatch]);

    const handleCreateNote = () => {
        dispatch(createNote({ ...noteData, audio: audioURL }, token));
        setOpen(false);
        setNoteData({ title: '', description: '', audio: null });
        setAudioURL(null);
    };

    const handleUpdateNote = () => {
        if (editingNote) {
            dispatch(updateNote({ ...editingNote, ...noteData, audio: audioURL }, token));
            setOpen(false);
            setNoteData({ title: '', description: '', audio: null });
            setEditingNote(null);
            setAudioURL(null);
        }
    };

    const handleDeleteNote = (id) => {
        dispatch(deleteNote(id, token));
    };

    const handleOpenDialog = (note = null) => {
        if (note) {
            setNoteData({ title: note.title, description: note.description, audio: null });
            setEditingNote(note);
        } else {
            setNoteData({ title: '', description: '', audio: null });
            setEditingNote(null);
        }
        setAudioURL(null); // Reset the audio URL when opening the dialog
        setOpen(true);
    };

    const handleCloseDialog = () => {
        setOpen(false);
        setNoteData({ title: '', description: '', audio: null });
        setEditingNote(null);
        setAudioURL(null);
    };

    // Start recording using MediaRecorder API
    const startRecording = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            audioStreamRef.current = stream;
            mediaRecorderRef.current = new MediaRecorder(stream);

            mediaRecorderRef.current.ondataavailable = (event) => {
                audioChunksRef.current.push(event.data);
            };

            mediaRecorderRef.current.onstop = () => {
                const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/mp3' });
                const audioUrl = URL.createObjectURL(audioBlob);
                setAudioURL(audioUrl);
            };

            mediaRecorderRef.current.start();
            setIsRecording(true);
        } catch (error) {
            console.error('Error starting audio recording:', error);
        }
    };

    // Stop recording and store audio
    const stopRecording = () => {
        if (mediaRecorderRef.current) {
            mediaRecorderRef.current.stop();
            audioStreamRef.current.getTracks().forEach((track) => track.stop());
        }
        setIsRecording(false);
    };

    return (
        <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <Button variant="contained" color="primary" onClick={() => handleOpenDialog()}>
                Create New Note
            </Button>

            {error && <p>{error}</p>}

            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Title</TableCell>
                            <TableCell>Description</TableCell>
                            <TableCell>Audio</TableCell>
                            <TableCell>Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {notes.map((note) => (
                            <TableRow key={note.id}>
                                <TableCell>{note.title}</TableCell>
                                <TableCell>{note.description}</TableCell>
                                <TableCell>
                                    {note.audio && <audio controls><source src={note.audio} type="audio/mp3" /></audio>}
                                </TableCell>
                                <TableCell>
                                    <Button variant="outlined" onClick={() => handleOpenDialog(note)}>Edit</Button>
                                    <Button variant="outlined" color="error" onClick={() => handleDeleteNote(note.id)}>Delete</Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

            {/* Dialog for Creating/Updating Notes */}
            <Dialog open={open} onClose={handleCloseDialog}>
                <DialogTitle>{editingNote ? 'Update Note' : 'Create Note'}</DialogTitle>
                <DialogContent>
                    <TextField
                        label="Title"
                        fullWidth
                        value={noteData.title}
                        onChange={(e) => setNoteData({ ...noteData, title: e.target.value })}
                        margin="normal"
                    />
                    <TextField
                        label="Description"
                        fullWidth
                        value={noteData.description}
                        onChange={(e) => setNoteData({ ...noteData, description: e.target.value })}
                        margin="normal"
                    />
                    {/* Audio Recording */}
                    <div style={{ marginTop: '16px' }}>
                        <Button 
                            variant="contained" 
                            color={isRecording ? 'secondary' : 'primary'} 
                            onClick={isRecording ? stopRecording : startRecording}
                        >
                            {isRecording ? 'Stop Recording' : 'Record Audio'}
                        </Button>
                        {audioURL && <audio controls><source src={audioURL} type="audio/mp3" /></audio>}
                    </div>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseDialog} color="primary">
                        Cancel
                    </Button>
                    <Button
                        onClick={editingNote ? handleUpdateNote : handleCreateNote}
                        color="primary"
                    >
                        {editingNote ? 'Update' : 'Create'}
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
};

export default Dashboard;
