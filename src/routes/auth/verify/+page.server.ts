import type { ServerLoad } from '@sveltejs/kit';

export const load: ServerLoad = async ({ url }) => {
  const code = url.searchParams.get('code');
  const email = url.searchParams.get('email');
  const sent = url.searchParams.get('sent');
  
  return {
    code,
    email,
    sent
  };
};


