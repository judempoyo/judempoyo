<script setup lang="ts">
const { t, locale } = useI18n()
const config = useRuntimeConfig()
const asset = usePublicAsset()
const origin = computed(() => String(config.public.siteUrl).replace(/\/+$/, ''))
const imageUrl = computed(() => `${origin.value}${asset('og-image.png')}`)
const homeUrl = computed(() => `${origin.value}${config.app.baseURL}`)
const pageUrl = computed(() => `${homeUrl.value}${locale.value === 'fr' ? 'fr/' : ''}`)
const { projects } = useProjects()
const contact = useContactLinks()
const llmsUrl = computed(() => `${homeUrl.value}llms.txt`)
const profileJsonUrl = computed(() => `${homeUrl.value}profile.json`)
useHead({ htmlAttrs: { lang: () => locale.value } })
useSeoMeta({
  titleTemplate: title => title ? `${title} | Jude Mpoyo` : 'Jude Mpoyo',
  ogTitle: () => `Jude Mpoyo | ${t('design.seo_title')}`,
  description: () => t('design.seo_description'),
  ogDescription: () => t('design.seo_description'),
  ogSiteName: 'Jude Mpoyo',
  ogImage: () => imageUrl.value,
  ogImageAlt: () => t('design.social_image_alt'),
  twitterImageAlt: () => t('design.social_image_alt'),
  twitterImage: () => imageUrl.value,
  twitterCard: 'summary_large_image',
  ogType: 'website',
  author: 'Jude Mpoyo',
  robots: 'index, follow, max-image-preview:large',
})
useHead(() => ({
  link: [
    { rel: 'author', href: homeUrl.value },
    { rel: 'alternate', type: 'text/plain', href: llmsUrl.value, title: 'LLM profile' },
    { rel: 'alternate', type: 'application/ld+json', href: profileJsonUrl.value, title: 'Jude Mpoyo profile' },
  ],
  meta: [
    { name: 'author', content: 'Jude Mpoyo' },
    { name: 'geo.placename', content: 'Kolwezi' },
    { name: 'geo.region', content: 'CD' },
  ],
  script: [{
    key: 'person-schema',
    type: 'application/ld+json',
    innerHTML: JSON.stringify({
      '@context': 'https://schema.org',
      '@graph': [
        {
          '@type': 'Person',
          '@id': `${homeUrl.value}#person`,
          name: 'Jude Mpoyo',
          url: homeUrl.value,
          image: `${origin.value}${asset('judepic.jpeg')}`,
          email: 'mailto:mpoyojude0@gmail.com',
          jobTitle: locale.value === 'fr' ? 'Développeur full-stack' : 'Full-stack developer',
          description: t('design.seo_description'),
          address: { '@type': 'PostalAddress', addressLocality: 'Kolwezi', addressCountry: 'CD' },
          knowsLanguage: ['fr', 'en'],
          knowsAbout: ['Laravel', 'PHP', 'Vue.js', 'Nuxt', 'TypeScript', 'Docker', 'Miabi', 'SQL'],
          sameAs: ['https://github.com/judempoyo', 'https://www.linkedin.com/in/judempoyo'],
          contactPoint: {
            '@type': 'ContactPoint',
            email: 'mpoyojude0@gmail.com',
            contactType: 'professional',
            availableLanguage: ['French', 'English'],
            url: contact.whatsapp.value || undefined,
          },
        },
        {
          '@type': 'ProfilePage',
          '@id': `${pageUrl.value}#profile`,
          url: pageUrl.value,
          name: `Jude Mpoyo | ${t('design.seo_title')}`,
          description: t('design.seo_description'),
          inLanguage: locale.value,
          mainEntity: { '@id': `${homeUrl.value}#person` },
          significantLink: [llmsUrl.value, profileJsonUrl.value],
          hasPart: projects.value.map(project => ({
            '@type': 'CreativeWork',
            name: t(project.titleKey),
            description: `${t(project.descriptionKey)} ${t(project.roleKey)} ${t(project.resultKey)}`,
            url: (project.isLive ? project.liveUrl : project.docsUrl) || pageUrl.value + `#project-${project.id}`,
            keywords: project.stack.join(', '),
            creativeWorkStatus: project.isLive ? 'Published' : (project.docsUrl ? 'Published' : 'Offline'),
          })),
        },
      ],
    }).replace(/</g, '\\u003c'),
  }],
}))
</script>



<template>
  <TimeEasterEgg />
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>
