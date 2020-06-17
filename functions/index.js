const functions = require('firebase-functions');
const app = require('express')();

const { 
    getAllNotes,
    getOneNote,
    postOneNote,
    deleteNote,
    editNote
} = require('./APIs/notes');

const auth = require('./utils/auth');

const {
    loginUser,
    signUpUser,
    uploadProfilePhoto,
    getUserDetail,
    updateUserDetails
} = require('./APIs/users');

app.get('/notes', auth, getAllNotes);
app.get('/note/:id', auth, getOneNote);
app.post('/note', postOneNote);
app.delete('/note/:id', auth, deleteNote);
app.put('/note/:id', auth, editNote);

app.post('/login', loginUser);
app.post('/signup', signUpUser);
app.post('/user/image', auth, uploadProfilePhoto);
app.get('/user', auth, getUserDetail);
app.put('/user', auth, updateUserDetails);

exports.api = functions.https.onRequest(app);