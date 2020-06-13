const { admin, db } = require('../utils/admin');
const config = require('../utils/config');

const firebase = require('firebase');

firebase.initializeApp(config);

const { validateLoginData, validateSignUpData } = require('../utils/validators');

exports.loginUser = (req, res) => { 
    const user = {
        email: req.body.email,
        password: req.body.password
    }

    const { valid, errors } = validateLoginData(user);
    if(!valid) return res.status(400).json(errors);

    firebase
        .auth()
        .signInWithEmailAndPassword(user.email, user.password)
        .then((data) => {
            return data.user.getIdToken();
        })
        .then((token) => {
            return res.json({ token });
        })
        .catch((err) => {
            console.error(err);
            return res.status(403).json({ general: 'wrong credentials, please try again' });
        });
}

exports.signUpUser = (req, res) => {
    const newUser = {
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        email: req.body.email,
        phoneNumber: req.body.phoneNumber,
        country: req.body.country,
		password: req.body.password,
		confirmPassword: req.body.confirmPassword,
		username: req.body.username
    };

    const { valid, errors } = validateSignUpData(newUser);

    if(!valid) return res.status(400).json(errors);

    let token, userId;

    db
        .doc(`/users/${newUser.username}`)
        .get()
        .then((doc) => {
            if(doc.exists) {
                return res.status(400).json({ username: 'this username is already taken' });
            } else {
                return firebase
                    .auth()
                    .createUserWithEmailAndPassword(
                        newUser.email,
                        newUser.password
                    );
            }
        })
        .then((data) => {
            userId = data.user.uid;
            return data.user.getIdToken();
        })
        .then((idToken) => {
            token = idToken;
            const userCredentials = {
                firstName: newUser.firstName,
                lastName: newUser.lastName,
                username: newUser.username,
                phoneNumber: newUser.phoneNumber,
                country: newUser.country,
                email: newUser.email,
                createdAt: new Date().toISOString(),
                userId
            };
            return  db
                    .doc(`/users/${newUser.username}`)
                    .set(userCredentials);
        })
        .then(() => {
            return res.status(201).json({ token });
        })
        .catch((err) => {
            console.error(err);
            if (err.code === 'auth/email-already-in-use') {
				return res.status(400).json({ email: 'Email already in use' });
			} else {
				return res.status(500).json({ general: 'Something went wrong, please try again' });
			}
        });
}

deleteImage = (imageName) => {
    const bucket = admin.storage().bucket();
    const path = `${imageName}`;

    return bucket.file(path).delete()
    .then(() => {
        return
    })
    .catch((err) => {
        return 
    })
}

exports.uploadProfilePhoto = (req, res) => {
    const BusBoy = require('busboy');
    const path = require('path');
    const os = require('os');
    const fs = require('fs');
    const busboy = new BusBoy({ headers: req.headers });

    let imageFileName;
    let imageToBeUploaded = {};

    busboy.on('file', (fieldname, file, filename, encoding, mimetype) => {
        if(mimetype !== 'image/png' || mimetype !== 'image/jpeg') {
            return res.status(400).json({ error: 'Wrong file type submited' });
        }
        const imageExtension = filename.split('.')[filename.split('.').length - 1];
        imageFileName = `${req.user.username}.${imageExtension}`;
        const filePath = path.join(os.tmpdir(), imageFileName)
        imageToBeUploaded = { filePath, mimetype };
        file.pipe(fs.createWriteStream(filePath));
    });
    deleteImage(imageFileName);
    //...
}