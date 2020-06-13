const functions = require('firebase-functions');
const app = require('express')();

const { 
    getAllNotes,
    postOneNote,
    deleteNote,
    editNote
} = require('./APIs/notes');

const {
    loginUser,
    signUpUser,
    uploadProfilePhoto
} = require('./APIs/users');

const auth = require('./utils/auth');

app.get('/notes', getAllNotes);
app.post('/note', postOneNote);
app.delete('/note/:id', deleteNote);
app.put('/note/:id', editNote);

app.post('/login', loginUser);
app.post('/signup', signUpUser);
app.post('/user/image', auth, uploadProfilePhoto)

exports.api = functions.https.onRequest(app);