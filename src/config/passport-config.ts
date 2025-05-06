import passport from 'passport';
import { Strategy as JwtStrategy, ExtractJwt } from 'passport-jwt';
import { config } from './app-config';
import { AccessTokenPayload } from '@shared/types/auth';

// Setup passport JWT strategy
export const configurePassport = () => {
  // JWT options
  const jwtOptions = {
    // Extract token from cookie or Auth header
    jwtFromRequest: ExtractJwt.fromExtractors([
      // Extract from cookie
      (req) => {
        if (req && req.cookies) {
          return req.cookies.accessToken;
        }
        return null;
      },
      // Extract from Authorization header as fallback
      ExtractJwt.fromAuthHeaderAsBearerToken()
    ]),
    secretOrKey: config.JWT_SECRET,
  };

  // Configure JWT strategy
  passport.use(
    new JwtStrategy(jwtOptions, (jwtPayload: AccessTokenPayload, done) => {
      // Check token type
      if (jwtPayload.type !== 'access') {
        return done(null, false);
      }

      // Only validate token structure, actual DB check will be done later if needed
      return done(null, jwtPayload);
    })
  );

  return passport;
}; 