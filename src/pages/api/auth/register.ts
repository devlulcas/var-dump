import type { APIRoute } from 'astro';
import { getAuth } from 'firebase-admin/auth';
import { z } from 'zod';
import { zfd } from 'zod-form-data';
import { app } from '../../../lib/firebase/server';

const userRegisterFormSchema = zfd.formData({
  email: zfd.text(z.string().email({ message: 'Use a valid e-mail' })),
  password: zfd.text(
    z.string().min(6, { message: 'Use at least 6 characters' })
  ),
  name: zfd.text(z.string().min(3, { message: 'Use at least 3 characters' })),
});

export const POST: APIRoute = async ({ request, redirect }) => {
  const auth = getAuth(app);

  /* Get form data */
  const formData = userRegisterFormSchema.safeParse(await request.formData());

  if (!formData.success) {
    const errorMessage = formData.error.flatten().formErrors.join(', ');
    return new Response(errorMessage, { status: 400 });
  }

  /* Create user */
  try {
    await auth.createUser({
      email: formData.data.email,
      password: formData.data.password,
      displayName: formData.data.name,
    });
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : 'Something went wrong';
    return new Response(errorMessage, { status: 400 });
  }

  return redirect('/signin');
};
