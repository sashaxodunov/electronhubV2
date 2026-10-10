import type { ReactNode } from 'react'

import AdminHeader from '@/components/admin/AdminHeader'
import AdminSidebar from '@/components/admin/AdminSidebar'
import AdminLogoutButton from '@/components/admin/AdminLogoutButton'
import { requireAdmin } from '@/lib/auth/require-admin'

interface AdminLayoutProps {
	children: ReactNode
}

export default async function AdminLayout({ children }: AdminLayoutProps) {
	await requireAdmin()

	return (
		<div className='min-h-screen bg-zinc-50 text-zinc-950 dark:bg-zinc-950 dark:text-zinc-50'>
			<AdminSidebar />

			<div className='lg:pl-64'>
				<AdminHeader />

				<main className='mx-auto max-w-7xl p-4 sm:p-6 lg:p-8'>
					<div className='mb-4 flex justify-end'>
						<AdminLogoutButton />
					</div>

					<div className='mx-auto max-w-7xl'>{children}</div>
				</main>
			</div>
		</div>
	)
}
