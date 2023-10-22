import type { APIRoute } from 'astro';
import { getFirestore } from 'firebase-admin/firestore';
import { FIREBASE_COLLECTIONS } from '../../../constants';
import { getAuthenticatedUser } from '../../../lib/firebase/auth';
import { app } from '../../../lib/firebase/server';
import { postFormSchema, type Post } from '../../../lib/posts/types';

const db = getFirestore(app);
const postsRef = db.collection(FIREBASE_COLLECTIONS.POSTS);

export const POST: APIRoute = async ({
  params,
  redirect,
  request,
  cookies,
}) => {
  const authenticatedUser = await getAuthenticatedUser(cookies);

  if (!authenticatedUser) {
    return new Response('Unauthorized', { status: 401 });
  }

  const formData = postFormSchema.safeParse(await request.formData());

  if (!formData.success) {
    const errorMessage = formData.error.flatten().formErrors.join(', ');
    return new Response(errorMessage, { status: 400 });
  }

  if (!params.id) {
    return new Response('Cannot find post', { status: 404 });
  }

  const post = await postsRef.doc(params.id).get();

  if (!post.exists) {
    return new Response('Cannot find post', { status: 404 });
  }

  const postData = post.data() as Post;

  if (postData.author.id !== authenticatedUser.uid) {
    return new Response('Unauthorized', { status: 401 });
  }

  try {
    await postsRef.doc(params.id).update({ content: formData.data.content });
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : 'Something went wrong';
    return new Response(errorMessage, { status: 500 });
  }

  return redirect('/dashboard');
};

export const DELETE: APIRoute = async ({ params, redirect, cookies }) => {
  if (!params.id) {
    return new Response('Cannot find post', {
      status: 404,
    });
  }

  const authenticatedUser = await getAuthenticatedUser(cookies);

  if (!authenticatedUser) {
    return new Response('Unauthorized', { status: 401 });
  }

  const post = await postsRef.doc(params.id).get();

  if (!post.exists) {
    return new Response('Cannot find post', { status: 404 });
  }

  const postData = post.data() as Post;

  if (postData.author.id !== authenticatedUser.uid) {
    return new Response('Unauthorized', { status: 401 });
  }

  try {
    await postsRef.doc(params.id).delete();
  } catch (error) {
    return new Response('Something went wrong', {
      status: 500,
    });
  }

  return redirect('/dashboard');
};
