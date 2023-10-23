import type { APIRoute } from 'astro';
import { getFirestore } from 'firebase-admin/firestore';
import { FIREBASE_COLLECTIONS } from '../../../constants';
import { getAuthenticatedUser } from '../../../lib/firebase/auth';
import { app } from '../../../lib/firebase/server';
import { postFormSchema, type NewPost } from '../../../lib/posts/types';

export const POST: APIRoute = async ({ request, redirect, cookies }) => {
  const formData = postFormSchema.safeParse(await request.formData());

  if (!formData.success) {
    const errorMessage = formData.error.flatten().formErrors.join(', ');
    return new Response(errorMessage, { status: 400 });
  }

  const authenticatedUser = await getAuthenticatedUser(cookies);

  if (!authenticatedUser) {
    return redirect('/signin');
  }

  const newPost: NewPost = {
    content: formData.data.content,
    author: {
      id: authenticatedUser.uid,
      name: authenticatedUser.displayName ?? 'anonymous',
      avatar: authenticatedUser.photoURL ?? '/avatar.svg',
    },
  };

  try {
    const db = getFirestore(app);
    const postsRef = db.collection(FIREBASE_COLLECTIONS.POSTS);

    await postsRef.add(newPost);
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : 'Something went wrong';
    return new Response(errorMessage, { status: 500 });
  }

  return redirect('/');
};
