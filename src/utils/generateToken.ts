import { Response } from 'express';
import jwt from 'jsonwebtoken';

const generateToken = (res: Response, userId: string, role: string) => {
  const token = jwt.sign({ userId, role }, process.env.JWT_SECRET || 'fallback_secret', {
    expiresIn: '30d',
  });

  res.cookie('jwt', token, {
    httpOnly: true, // prevents JS access to cookie
    secure: true, // required for SameSite=None over HTTPS
    sameSite: 'none', // REQUIRED for cross-site cookies
    maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
  });
};

export default generateToken;
