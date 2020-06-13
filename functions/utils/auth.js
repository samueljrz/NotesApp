const { admin, db } = require('./admin');

module.exports = (req, res, next) => {
    let idToken;
    if(req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
        idToken = req.headers.authorization.split('Bearer ')[1];
    }else {
        console.error('No token found!');
		return res.status(401).json({ error: 'Unauthorized!' });
    }
    admin
        .auth()
        .verifyIdToken(idToken)
        .then((decodedToken) => {
            req.user = decodedToken;
            return db.collection('users').where('userId', '==', req.user.uid).limit(1).get();
        })
        .then((data) => {
            req.user.username = data.docs[0].data().username;
            req.user.imageUrl = data.docs[0].data().imageUrl;
            return next();
        })
        .catch((err) => {
            console.error('Error while verifying token', err);
            return res.status(401).json(err);
        });
}