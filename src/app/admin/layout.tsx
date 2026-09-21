import type { ReactNode } from 'react'
import AdminHeader from '@/components/admin/AdminHeader'
import AdminSidebar from '@/components/admin/AdminSidebar'

interface AdminLayoutProps {
	children: ReactNode
}

export default function AdminLayout({ children }: AdminLayoutProps) {
	return (
		<div className='min-h-screen bg-zinc-50 text-zinc-950 dark:bg-zinc-950 dark:text-zinc-50'>
			<AdminSidebar />

			<div className='lg:pl-64'>
				<AdminHeader />

				<main className='p-4 sm:p-6 lg:p-8'>
					<div className='mx-auto max-w-7xl'>{children}</div>
				</main>
			</div>
		</div>
	)
}
