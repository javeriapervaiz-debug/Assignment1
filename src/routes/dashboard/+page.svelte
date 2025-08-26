<script lang="ts">
  import { enhance } from '$app/forms';
  export let data: { user: any };

  let firstName = data.user?.firstName || '';
  let lastName = data.user?.lastName || '';
  let email = data.user?.email || '';
  let newPassword = '';
  let avatarPreview: string | null = data.user?.profileImageUrl || null;

  function onAvatarChange(e: Event) {
    const input = e.target as HTMLInputElement;
    const file = input.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      avatarPreview = url;
    }
  }
  // Using default enhance without custom handlers for simplicity
</script>

<div class="min-h-screen bg-gray-950 text-white p-6 md:p-12">
  <h1 class="text-3xl font-bold mb-6">Profile</h1>

  <div class="grid md:grid-cols-3 gap-6">
    <div class="bg-gray-900 border border-gray-800 rounded-xl p-6 flex flex-col items-center gap-4">
      <div class="w-32 h-32 rounded-full overflow-hidden bg-gray-800 border border-gray-700">
        {#if avatarPreview}
          <img src={avatarPreview} alt="Avatar" class="w-full h-full object-cover" />
        {:else}
          <div class="w-full h-full flex items-center justify-center text-gray-500">No photo</div>
        {/if}
      </div>
      <form method="post" use:enhance enctype="multipart/form-data">
        <input type="hidden" name="/dashboard" value="avatar" />
        <input name="avatar" type="file" accept="image/*" class="block text-sm text-gray-300" on:change={onAvatarChange} />
        <button formaction="?/avatar" class="mt-3 bg-gray-700 hover:bg-gray-600 text-white px-3 py-2 rounded">Upload</button>
      </form>
    </div>

    <div class="md:col-span-2 bg-gray-900 border border-gray-800 rounded-xl p-6">
      <form method="post" use:enhance class="space-y-4">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label class="block text-sm text-gray-400 mb-1">First name</label>
            <input name="firstName" bind:value={firstName} class="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded" />
          </div>
          <div>
            <label class="block text-sm text-gray-400 mb-1">Last name</label>
            <input name="lastName" bind:value={lastName} class="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded" />
          </div>
        </div>
        <div>
          <label class="block text-sm text-gray-400 mb-1">Email</label>
          <input name="email" type="email" bind:value={email} class="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded" />
        </div>
        <div>
          <label class="block text-sm text-gray-400 mb-1">New password</label>
          <input name="newPassword" type="password" bind:value={newPassword} class="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded" />
        </div>
        <div class="flex gap-3">
          <button formaction="?/update" class="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded">Save changes</button>
        </div>
      </form>
      <form method="post" action="/logout" class="mt-4">
        <button class="bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded">Log out</button>
      </form>
      <form method="post" action="?/delete" class="mt-6" on:submit={() => confirm('Are you sure? This cannot be undone.') }>
        <button class="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded">Delete account</button>
      </form>
    </div>
  </div>
</div>
