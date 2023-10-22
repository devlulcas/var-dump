import type { APIRoute } from 'astro';
import { getFirestore } from 'firebase-admin/firestore';
import { app } from '../../../lib/firebase/server';

export const POST: APIRoute = async ({ request, redirect }) => {
  const formData = await request.formData();

  const content = formData.get('content')?.toString();

  if (!content) {
    return new Response('Missing required fields', {
      status: 400,
    });
  }

  try {
    const db = getFirestore(app);
    const postsRef = db.collection('posts');
    await postsRef.add({ content });
  } catch (error) {
    return new Response('Something went wrong', {
      status: 500,
    });
  }

  return redirect('/dashboard');
};
