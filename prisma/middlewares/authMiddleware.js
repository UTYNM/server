import jwt from 'jsonwebtoken';

export const generateToken = (user) => {
  return jwt.sign(
    {
      id: user.id,
      name: user.name,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: 3600,
    }
  );
};

export const authenticateToken = (req, res, next) => {
  const token = req.header('Authorization');
  if (!token) {
    return res
      .status(401)
      .json({ success: false, message: 'Bearer token is required' });
  }
  const plainToken = token.split(' ')[1];
  jwt.verify(plainToken, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      console.log(err);
      return res.status(403).json({ success: false, message: 'Token invalid' });
    }
    req.user = user;
    next();
  });
};    
