'use client'

import { useFormStatus } from 'react-dom'

import { logoutAdmin } from '@/actions/auth'

function LogoutSubmitButton() {
	const { pending } = useFormStatus()

	return (
		<button
			type='submit'
			disabled={pending}
			className='rounded-lg border border-zinc-300 px-3 py-2 text-sm font-medium text-zinc-700 transition hover:bg-zinc-100 disabled:opacity-60 dark:border-zinc-700 dark:text-zinc-200 dark:hover:bg-zinc-800'
		>
			{pending ? 'Выход…' : 'Выйти'}
		</button>
	)
}

export default function AdminLogoutButton() {
	return (
		<form action={logoutAdmin}>
			<LogoutSubmitButton />
		</form>
	)
}
