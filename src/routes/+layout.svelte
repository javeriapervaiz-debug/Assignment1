<script>
  import '../app.css';
</script>

<nav class="p-4 bg-gray-800 text-white flex justify-between">
  <a href="/" class="font-bold">Auth App</a>
  <div>
    <a href="/auth/login" class="mr-4 hover:underline">Login</a>
    <a href="/auth/register" class="hover:underline">Register</a>
  </div>
</nav>
<slot />
