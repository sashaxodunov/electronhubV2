import { redirect } from 'next/navigation'

import AdminLoginForm from '@/components/admin/AdminLoginForm'
import { isAdminAuthenticated } from '@/lib/auth/require-admin'

export const metadata = {
	title: 'Вход в админ-панель | ElectronHub',
	robots: {
		index: false,
		follow: false
	}
}

export default async function AdminLoginPage() {
	if (await isAdminAuthenticated()) {
		redirect('/admin')
	}

	return (
		<main className='flex min-h-screen items-center justify-center bg-zinc-100 px-4 py-12 dark:bg-zinc-950'>
			<section className='w-full max-w-md rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm sm:p-8 dark:border-zinc-800 dark:bg-zinc-900'>
				<div className='mb-8 space-y-2'>
					<p className='text-sm font-medium text-blue-600'>ElectronHub</p>

					<h1 className='text-2xl font-semibold text-zinc-900 dark:text-white'>
						Вход в админ-панель
					</h1>

					<p className='text-sm text-zinc-500 dark:text-zinc-400'>
						Введите пароль для продолжения.
					</p>
				</div>

				<AdminLoginForm />
			</section>
		</main>
	)
}
