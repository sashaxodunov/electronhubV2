'use server'

import 'server-only'

import { redirect } from 'next/navigation'

import {
	createAdminSession,
	destroyAdminSession,
	verifyAdminPassword
} from '@/lib/auth/require-admin'

export type LoginState = {
	error: string
}

export async function loginAdmin(
	_previousState: LoginState,
	formData: FormData
): Promise<LoginState> {
	const password = formData.get('password')

	if (typeof password !== 'string' || !password) {
		return { error: 'Введите пароль.' }
	}

	if (!process.env.ADMIN_PASSWORD) {
		return {
			error: 'Авторизация не настроена. Проверьте переменные окружения.'
		}
	}

	if (!verifyAdminPassword(password)) {
		return { error: 'Неверный пароль.' }
	}

	try {
		await createAdminSession()
	} catch {
		return {
			error: 'Не удалось создать сессию. Проверьте настройки сервера.'
		}
	}

	redirect('/admin')
}

export async function logoutAdmin(): Promise<void> {
	await destroyAdminSession()
	redirect('/admin-login')
}