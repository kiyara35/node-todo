const jwt = require('jsonwebtoken')

const verifyToken = (req, res, next) => {
    const token =
        req.body.token || req.query.token || req.headers['x-access-token']
    if (!token) {
        return res.status(403).send('Unauthorized')
    }
    try {
        const decoded = jwt.verify(token, 'Rest')
        req.user = decoded
    } catch (err) {
        return res.status(401).send('Invalid token')
    }
    return next()

}

module.exports = verifyToken