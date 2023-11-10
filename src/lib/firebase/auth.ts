import type { AstroCookies } from 'astro';
import { getAuth } from 'firebase-admin/auth';
import { COOKIES_NAMES } from '../../constants';
import { app } from './server';

export async function getAuthenticatedUser(cookies: AstroCookies) {
  try {
    const auth = getAuth(app);

    const sessionCookie = cookies.get(COOKIES_NAMES.SESSION);

    const sessionCookieValue = sessionCookie?.value;

    if (!sessionCookieValue) {
      return null;
    }

    const decodedCookie = await auth.verifySessionCookie(sessionCookieValue);

    const user = await auth.getUser(decodedCookie.uid);

    return user;
  } catch (error) {
    console.log(error);
    return null;
  }
}
