<script>
  import { page } from '$app/stores';
  import { onMount } from 'svelte';
  
  let clientId = '';
  let redirectUri = '';
  let fullUrl = '';
  
  onMount(async () => {
    const response = await fetch('/auth/test-oauth');
    const data = await response.json();
    clientId = data.google_client_id;
    redirectUri = 'http://localhost:5173/auth/callback/google';
    fullUrl = data.google_url;
  });
</script>

<div class="p-8 max-w-2xl mx-auto">
  <h1 class="text-2xl font-bold mb-6">OAuth Debug Information</h1>
  
  <div class="space-y-4">
    <div>
      <strong>Client ID (partial):</strong> {clientId}
    </div>
    
    <div>
      <strong>Redirect URI:</strong> {redirectUri}
    </div>
    
    <div>
      <strong>Full OAuth URL:</strong>
      <div class="bg-gray-100 p-4 rounded text-sm break-all">
        {fullUrl}
      </div>
    </div>
    
    <div class="mt-6">
      <a 
        href={fullUrl}
        class="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
      >
        Test Google OAuth
      </a>
    </div>
  </div>
</div>
