import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-google-oauth20';
import { config } from 'dotenv';

config({ path: 'cred.env' }); // Load from .env or cred.env

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  constructor() {
    super({
      clientID: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      callbackURL: 'http://localhost:3000/auth/google/callback',
      scope: ['profile', 'email'],
    });
  }

  async validate(
    accessToken: string,
    refreshToken: string,
    profile: any,
  ): Promise<any> {
    const user = {
      email: profile.emails?.[0]?.value,
      name: profile.displayName,
      picture: profile.photos?.[0]?.value,
      googleId: profile.id,
    };
    return user;
  }
}
