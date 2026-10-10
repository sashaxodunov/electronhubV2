'use client'

import { useActionState } from 'react'

import { loginAdmin } from '@/actions/auth'

const initialState = {
	error: ''
}

export default function AdminLoginForm() {
	const [state, formAction, pending] = useActionState(loginAdmin, initialState)

	return (
		<form
			action={formAction}
			className='space-y-5'
		>
			<div className='space-y-2'>
				<label
					htmlFor='password'
					className='block text-sm font-medium text-zinc-700 dark:text-zinc-300'
				>
					Пароль администратора
				</label>

				<input
					id='password'
					name='password'
					type='password'
					autoComplete='current-password'
					required
					autoFocus
					className='w-full rounded-lg border border-zinc-300 bg-white px-4 py-3 text-zinc-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 dark:border-zinc-700 dark:bg-zinc-900 dark:text-white'
					placeholder='Введите пароль'
				/>
			</div>

			{state.error && (
				<p
					role='alert'
					className='rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700 dark:bg-red-950/40 dark:text-red-300'
				>
					{state.error}
				</p>
			)}

			<button
				type='submit'
				disabled={pending}
				className='w-full rounded-lg bg-blue-600 px-4 py-3 font-medium text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60'
			>
				{pending ? 'Выполняется вход…' : 'Войти'}
			</button>
		</form>
	)
}
