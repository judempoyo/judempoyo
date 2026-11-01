export interface Project {
    id: string
    titleKey: string
    descriptionKey: string
    roleKey: string
    resultKey: string
    detailsKey?: string
    contributions?: { number: number; descriptionKey: string; url: string }[]
    stack: string[]
    metrics: {
        loadTime?: string
        dockerSize?: string
        infraKey: string
    }
    archDiagram?: string
    archKey?: string
    isLive: boolean
    liveUrl?: string
    docsUrl?: string
}

export const useProjects = () => {
    const projects = computed<Project[]>(() => [
        {
            id: 'smartcyberspace',
            titleKey: 'projects.smartcyberspace.title',
            descriptionKey: 'projects.smartcyberspace.description',
            roleKey: 'projects.smartcyberspace.role',
            resultKey: 'projects.smartcyberspace.result',
            detailsKey: 'projects.smartcyberspace.details',
            stack: ['Laravel 11', 'Vue.js', 'Tailwind CSS', 'Miabi', 'SQL'],
            metrics: { infraKey: 'projects.smartcyberspace.infra' },
            isLive: true,
            liveUrl: 'https://smartcyberspace.ca/'
        },
        {
            id: 'uzaraka',
            titleKey: 'projects.uzaraka.title',
            descriptionKey: 'projects.uzaraka.description',
            roleKey: 'projects.uzaraka.role',
            resultKey: 'projects.uzaraka.result',
            detailsKey: 'projects.uzaraka.details',
            stack: ['Nuxt 3'],
            metrics: {
                infraKey: 'projects.uzaraka.infra'
            },
            isLive: false
        },
        {
            id: 'miabi',
            titleKey: 'projects.miabi.title',
            descriptionKey: 'projects.miabi.description',
            roleKey: 'projects.miabi.role',
            resultKey: 'projects.miabi.result',
            detailsKey: 'projects.miabi.details',
            stack: ['Vue 3', 'Go'],
            metrics: { infraKey: 'projects.miabi.infra' },
            isLive: false,
            docsUrl: 'https://github.com/miabi-io/miabi',
            contributions: [50, 52, 58, 90, 214, 251].map(number => ({
                number,
                descriptionKey: `projects.miabi.pr_${number}`,
                url: `https://github.com/miabi-io/miabi/pull/${number}`
            }))
        },
        {
            id: 'goposta',
            titleKey: 'projects.goposta.title',
            descriptionKey: 'projects.goposta.description',
            roleKey: 'projects.goposta.role',
            resultKey: 'projects.goposta.result',
            stack: ['Vue', 'Go'],
            metrics: { infraKey: 'projects.goposta.infra' },
            isLive: false,
            docsUrl: 'https://github.com/goposta/posta',
            contributions: [61, 69, 126].map(number => ({
                number,
                descriptionKey: `projects.goposta.pr_${number}`,
                url: `https://github.com/goposta/posta/pull/${number}`
            }))
        },
        {
            id: 'laraapistarter',
            titleKey: 'projects.laraapistarter.title',
            descriptionKey: 'projects.laraapistarter.description',
            roleKey: 'projects.laraapistarter.role',
            resultKey: 'projects.laraapistarter.result',
            stack: ['Laravel 12', 'Actions', 'DTOs', 'REST API'],
            metrics: {
                infraKey: 'projects.laraapistarter.infra'
            },
            archDiagram: 'Laravel 12 --> Actions/DTOs --> REST API',
            isLive: false,
            docsUrl: 'https://github.com/judempoyo/laraApiStarter'
        }
    ])

    return { projects }
}
