import { Footer } from '@/components/layout/footer'
import { Header } from '@/components/layout/header'
import type { Metadata } from 'next'

import ElectronicsGlassBackground from '@/components/layout/ElectronicsGlassBackground'
import { siteConfig } from '@/config/site'

export const metadata: Metadata = {
	title: {
		default: siteConfig.metadata.defaultTitle,
		template: siteConfig.metadata.titleTemplate
	},

	description: siteConfig.metadata.description,

	keywords: [...siteConfig.keywords],

	authors: [
		{
			name: siteConfig.author.name,
			url: siteConfig.author.url
		}
	],

	metadataBase: new URL(siteConfig.url),

	alternates: {
		canonical: '/'
	},

	openGraph: {
		type: 'website',
		locale: siteConfig.metadata.openGraph.locale,
		siteName: siteConfig.metadata.openGraph.siteName,
		url: siteConfig.metadata.openGraph.url,
		title: siteConfig.metadata.defaultTitle,
		description: siteConfig.metadata.description
	},

	robots: {
		index: siteConfig.metadata.robots.index,
		follow: siteConfig.metadata.robots.follow
	}
}

export default function SiteLayout({
	children
}: Readonly<{
	children: React.ReactNode
}>) {
	return (
		<div className='min-h-screen bg-background text-foreground'>
			{/* <ElectronicsGlassBackground /> */}
			<Header />

			<main className='min-h-[calc(100vh-8rem)] mx-auto max-w-6xl'>
				<ElectronicsGlassBackground />
				{children}
			</main>

			<Footer />
		</div>
	)
}
