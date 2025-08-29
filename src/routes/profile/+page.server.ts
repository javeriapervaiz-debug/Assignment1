import type { Actions, PageServerLoad } from './$types';
import { updateUserProfile, deleteUserAccount } from '$lib/auth';
import { randomBytes } from 'crypto';
import { extname } from 'path';
import { writeFile } from 'fs/promises';

export const load: PageServerLoad = async ({ locals }) => {
  return {
    user: locals.user
  };
};

export const actions: Actions = {
  update: async ({ locals, request }) => {
    if (!locals.user) return { status: 401 };
    const data = await request.formData();
    const firstName = (data.get('firstName') as string) ?? null;
    const lastName = (data.get('lastName') as string) ?? null;
    const email = (data.get('email') as string) ?? null;
    const newPassword = (data.get('newPassword') as string) || null;
    await updateUserProfile(locals.user.id, {
      firstName,
      lastName,
      email,
      password: newPassword || undefined
    });
    return { success: true };
  },
  avatar: async ({ locals, request }) => {
    if (!locals.user) return { status: 401 };
    const data = await request.formData();
    const file = data.get('avatar');
    if (!file || typeof file === 'string') return { error: 'No file uploaded' };
    const filenameBase = randomBytes(8).toString('hex');
    const originalName = (file as File).name || '';
    const ext = extname(originalName || '.png') || '.png';
    const filename = `${filenameBase}${ext}`;
    const bytes = Buffer.from(await (file as File).arrayBuffer());
    const destPath = `static/uploads/${filename}`;
    await writeFile(destPath, bytes);
    const publicUrl = `/uploads/${filename}`;
    await updateUserProfile(locals.user.id, { profileImageUrl: publicUrl });
    return { success: true, profileImageUrl: publicUrl };
  },
  delete: async ({ locals, cookies }) => {
    if (!locals.user) return { status: 401 };
    await deleteUserAccount({ cookies } as any, locals.user.id);
    return { deleted: true };
  }
};
