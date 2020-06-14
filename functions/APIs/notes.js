const { db } = require('../utils/admin');

exports.getAllNotes = (req, res) => {
    db
        .collection('notes')
        .where('username', '==', req.user.username)
        .orderBy('createdAt', 'desc')
        .get()
        .then((data) => {
            let notes = [];
            data.forEach((note) => {
                notes.push({
                    noteId: note.id,
                    title: note.data().title,
                    content: note.data().content,
                    importance: note.data().importance,
                    createdAt: note.data().createdAt
                });
            });
            return res.json(notes);
        })
        .catch((err) => {
            console.error(err);
            return res.status(500).json({ error: err.code });
        });
}

exports.getOneNote = (req, res) => {
    const { id } = req.params;
    const document = db.doc(`/notes/${id}`);

    document
        .get()
        .then((data) => {
            if(!data.exists) {
                return res.status(400).json({ error: 'Note not found!' });
            }

            return res.json(data.data());
        })
        .catch((err) => {
            console.error(err);
            return res.status(500).json({ error: err.code });
        })
}

exports.postOneNote = (req, res) => {
    if(!req.body.content) {
        return res.status(400).json({ content: 'Must not be empty!' });
    }
    if(!req.body.title) {
        return res.status(400).json({ title: 'Must not be empty!' });
    }

    const newNote = {
        username: request.user.username,
        title: req.body.title,
        content: req.body.content,
        importance: req.body.importance,
        createdAt: new Date().toISOString()
    }
    
    db
        .collection('notes')
        .add(newNote)
        .then((data) => {
            const resNote = {
                ...newNote,
                noteId: data.id
            };
            
            return res.json(resNote); 
        })
        .catch((err) => {
            res.status(500).json({ error: 'Something went wrong!' });
            return console.error(err);
        });    

}

exports.deleteNote = (req, res) => {
    const { id } = req.params;
    const document = db.doc(`/notes/${id}`);
    
    document
        .get()
        .then((data) => {
            if(!data.exists) {
                return res.status(400).json({ error: 'Note not found!' });
            }
            if(data.data().username !== req.user.username){
                return response.status(403).json({ error:"UnAuthorized!" })
           }
            
            return document.delete();
        })
        .then(() => {
            res.json({ message: 'Delete successfull!' });
        })
        .catch((err) => {
            console.error(err);
            return res.status(500).json({ error: err.code });
        })
}

exports.editNote = (req, res) => {
    const { id } = req.params;

    if(req.body.noteId || req.body.createdAt) {
        res.status(403).json({ message: 'Not allowed to edit!' });
    }    

    let document = db.collection('notes').doc(`${id}`);

    document.update(req.body)
        .then(() => {
            res.json({ message: 'Updated successfully' });
        })
        .catch((err) => {
            console.error(err);
            return res.status(500).json({ error: err.code });
        });
}