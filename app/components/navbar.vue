<template>
  <div class="navbar bg-primary shadow-sm">
    <div class="navbar-start">
      <NuxtLink to="/" class="pl-6 text-xl">
        Travel Log
      </NuxtLink>
    </div>
    <div class="navbar-end">
      <theme-toggle />
      <AuthButton />
    </div>
  </div>
</template>
