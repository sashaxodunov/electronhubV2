import Breadcrumbs from '@/components//navigation/breadcrumbs'
export default function datasheetLayout({
	children
}: Readonly<{
	children: React.ReactNode
}>) {
	return (
		<div className='min-h-screen bg-background text-foreground'>
			{/* <ElectronicsGlassBackground /> */}

			<main className='mx-auto w-full max-w-300 min-h-[calc(100vh-8rem)]'>
				<Breadcrumbs />
				{children}
			</main>
		</div>
	)
}
