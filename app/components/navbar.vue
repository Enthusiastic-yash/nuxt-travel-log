<template>
  <div class="navbar bg-primary shadow-sm">
    <div class="navbar-start">
      <NuxtLink to="/" class="pl-6 text-xl">
        Travel Log
      </NuxtLink>
    </div>
    <div class="navbar-end">
      <theme-toggle />
      <a class="btn btn-accent">Sign In
        <icon name="tabler:brand-github" size="24" />
      </a>
    </div>
  </div>
</template>
