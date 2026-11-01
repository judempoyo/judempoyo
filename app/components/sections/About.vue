<script setup lang="ts">
const { t } = useI18n()
const asset = usePublicAsset()
const showPhoto = ref(false)
let clicks = 0
let clickTimer: ReturnType<typeof setTimeout> | undefined
const handleNameClick = () => {
  clicks++
  clearTimeout(clickTimer)
  if (clicks === 3) { showPhoto.value = true; clicks = 0 }
  clickTimer = setTimeout(() => { clicks = 0 }, 500)
}
const handleKey = (event: KeyboardEvent) => {
  if (event.ctrlKey && event.shiftKey && event.key.toLowerCase() === 'j') {
    event.preventDefault()
    showPhoto.value = !showPhoto.value
  }
}
onMounted(() => window.addEventListener('keydown', handleKey))
onBeforeUnmount(() => { window.removeEventListener('keydown', handleKey); clearTimeout(clickTimer) })
</script>

<template>
  <PhotoModal v-model:show="showPhoto" />
  <section id="about" class="about-section shell" aria-labelledby="about-title">
    <div class="about-title-block" data-reveal>
      <p class="eyebrow">03 / {{ t('nav.about') }}</p>
      <h2 id="about-title">{{ t('design.about_title') }}</h2><button type="button" class="portrait-frame"
        :aria-label="t('design.show_photo')" @click="showPhoto = true"><img :src="asset('judepic.jpeg')"
          alt="Jude Mpoyo" width="480" height="600" loading="lazy" decoding="async" /><span
          class="portrait-caption"><span>Jude / Kolwezi</span><span aria-hidden="true">↗</span></span></button><button
        type="button" class="name-signature" @click="handleNameClick">Jude Mpoyo<span
          aria-hidden="true">↗</span></button>
      <p class="annotation">Kolwezi, {{ t('design.country') }}<br />{{ t('design.about_location') }}</p>
    </div>
    <div class="about-body" data-reveal>
      <p class="about-lead">{{ t('about.bio_1') }}</p>
      <p>{{ t('about.bio_2') }}</p>
      <div id="golang" class="golang-block"><span class="golang-word" aria-hidden="true"><span
            class="go-glyph">G</span><span class="go-glyph">o</span><span class="go-glyph go-dot">.</span></span>
        <div>
          <p class="eyebrow">Golang / DevOps</p>
          <h3>{{ t('design.go_heading') }}</h3>
          <p>{{ t('design.go_body') }}</p><span class="learning-label annotation"><span aria-hidden="true">↗</span> {{
            t('design.go_status') }}</span>
        </div>
      </div>
      <div class="practice-stack"><span class="annotation">{{ t('design.daily_tools') }}</span>
        <p>Laravel / PHP · Nuxt / Vue · TypeScript · Docker · SQL</p>
      </div>
    </div>
  </section>
</template>
