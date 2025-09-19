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

const validationMiddleware = (req, res, next) => {
  const { firstName, lastName, email, password } = req.body;
  if (firstName.length > 20 || lastName.length > 20 || !email || !password) {
    return res
      .status(400)
      .json({
        message:
          "Validation failed. Please provide all required fields with valid data.",
      });
  }
  next();
};

module.exports = { userAuth, adminAuth, validationMiddleware };