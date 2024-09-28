// jwtStrategy.js

import { Strategy as JwtStrategy, ExtractJwt } from 'passport-jwt';
import passport from 'passport';
import User from '../../models/users.js';
import dotenv from "dotenv";
dotenv.config()

const opts = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: process.env.JWTSECRET_KEY,
};

passport.use(
  new JwtStrategy(opts, async (jwt_payload, done) => {
    try {
      const user = await User.findOne({ _id: jwt_payload.id });
      if (user) {
        return done(null, user); // Successfully found user
      } else {
        return done(null, false); // User not found
      }
    } catch (error) {
      return done(error, false);
    }
  })
);

export default passport;
