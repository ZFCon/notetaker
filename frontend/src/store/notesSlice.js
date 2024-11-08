import { createSlice } from '@reduxjs/toolkit';
import api from '../api/api';

const initialState = {
    notes: [],
    loading: false,
    error: null,
};

const notesSlice = createSlice({
    name: 'notes',
    initialState,
    reducers: {
        setLoading: (state) => {
            state.loading = true;
        },
        setNotes: (state, action) => {
            state.notes = action.payload;
            state.loading = false;
        },
        addNote: (state, action) => {
            state.notes.push(action.payload);
        },
        modifyNote: (state, action) => {
            const updatedNotes = state.notes.map(note =>
                note.id === action.payload.id ? { ...note, ...action.payload } : note
            );
            state.notes = updatedNotes;
        },
        removeNote: (state, action) => {
            state.notes = state.notes.filter(note => note.id !== action.payload);
        },
        setError: (state, action) => {
            state.error = action.payload;
            state.loading = false;
        },
    },
});

// Export actions
export const { setLoading, setNotes, addNote, modifyNote, removeNote, setError } = notesSlice.actions;

// Thunks for async actions
export const createNote = (noteData) => async (dispatch) => {
    dispatch(setLoading());
    try {
        let audioFile = null;

        // If audio is a Blob URL, convert it to a File
        if (noteData.audio && noteData.audio.startsWith('blob:')) {
            const response = await fetch(noteData.audio); // Fetch the blob
            const audioBlob = await response.blob(); // Get the Blob data

            // Convert the Blob to a File (you can change the filename and type if necessary)
            audioFile = new File([audioBlob], 'recording.mp3', { type: 'audio/mp3' });
        }

        // Prepare FormData
        const formData = new FormData();
        formData.append('title', noteData.title);
        formData.append('description', noteData.description);
        
        // Append audio file to FormData if it's available
        if (audioFile) {
            formData.append('audio', audioFile);
        }

        // Send the request
        const response = await api.post('/notes/', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });

        dispatch(addNote(response.data));
    } catch (err) {
        dispatch(setError('Failed to create note: ' + err.message));
    }
};

export const fetchNotes = () => async (dispatch) => {
    dispatch(setLoading());
    try {
        const response = await api.get('/notes/');
        dispatch(setNotes(response.data));
    } catch (err) {
        dispatch(setError('Failed to fetch notes'));
    }
};

export const updateNote = (noteData) => async (dispatch) => {
    dispatch(setLoading());
    try {
        const response = await api.patch(`/notes/${noteData.id}/`, noteData);
        dispatch(modifyNote(response.data));
    } catch (err) {
        dispatch(setError('Failed to update note'));
    }
};

export const deleteNote = (id) => async (dispatch) => {
    dispatch(setLoading());
    try {
        await api.delete(`/notes/${id}/`);
        dispatch(removeNote(id));
    } catch (err) {
        dispatch(setError('Failed to delete note'));
    }
};

export default notesSlice.reducer;
