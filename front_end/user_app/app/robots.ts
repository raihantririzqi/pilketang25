import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
    return {
        rules: {
            userAgent: '*',
            allow: '/',
            disallow: '/private/', // Larang folder jika ada folder admin/rahasia
        },
        sitemap: 'https://nordbyte25.site/sitemap.xml',
    }
}