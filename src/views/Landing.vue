<script setup lang="ts">
import FeaturesWidget from '@/components/landing/FeaturesWidget.vue';
import FooterWidget from '@/components/landing/FooterWidget.vue';
import HeroWidget from '@/components/landing/HeroWidget.vue';
import HighlightsWidget from '@/components/landing/HighlightsWidget.vue';
import TopbarWidget from '@/components/landing/TopbarWidget.vue';
</script>

<template>
    <div class="bg-[#edeae4]">
        <div id="home" class="landing-wrapper">
            <TopbarWidget />
            <HeroWidget />
            <FeaturesWidget />
            <HighlightsWidget />
            <FooterWidget />
        </div>
    </div>
</template>

<!---

1.	Código para la colocar lo más arriba posible en la sección <head> de la página:
<script>(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','GTM-NX69X7KL');</script>

2.	Código justo después para la etiqueta de apertura <body> de la página:



-->