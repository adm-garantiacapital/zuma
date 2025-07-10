<template>
  <div class="bg-surface-0 dark:bg-surface-900">
    <div id="home" class="landing-wrapper">
      <TopbarWidget />
 

      <FooterWidget />
    </div>
  </div>
</template>

<script setup>
import TopbarWidget from '@/components/landing/TopbarWidget.vue'
import FooterWidget from '@/components/landing/FooterWidget.vue'
</script>