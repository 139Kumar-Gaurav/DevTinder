const userAuth = (req, res, next) => {
    const token = 'xyz'; // Simulated token
    if (token === 'xyz') {
        next();
    } else {
        res.status(401).send('Unauthorized: Invalid user token');
    }
};

const adminAuth = (req, res, next) => {
    const token = 'abc'; // Simulated token
    if (token === 'abc') {
        next();
    } else {
        res.status(403).send('Forbidden: Invalid admin token');
    }
};

module.exports = { userAuth, adminAuth };