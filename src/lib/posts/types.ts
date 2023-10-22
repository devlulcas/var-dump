import { z } from 'zod';
import { zfd } from 'zod-form-data';

export const postFormSchema = zfd.formData({
  content: zfd.text(
    z.string().min(3, { message: 'Use at least 3 characters' }).max(480, {
      message: 'Use at most 480 characters',
    })
  ),
});

export type Post = {
  id: string;
  content: string;
  createdAt: number;
  updatedAt: number;
  author: PostAuthor;
};

export type PostAuthor = {
  id: string;
  name: string;
  avatar: string;
};

export type NewPost = z.infer<typeof postFormSchema> & {
  author: PostAuthor;
};
