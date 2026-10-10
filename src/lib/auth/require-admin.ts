import 'server-only'

import { createHmac, timingSafeEqual } from 'node:crypto'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

const COOKIE_NAME = 'electronhub_admin_session'
const SESSION_DURATION = 8 * 60 * 60

type SessionPayload = {
	iat: number
	exp: number
	v: 1
}

function getSessionSecret(): string | null {
	const secret = process.env.ADMIN_SESSION_SECRET

	if (!secret || Buffer.byteLength(secret, 'utf8') < 32) {
		return null
	}

	return secret
}

function sign(value: string, secret: string): string {
	return createHmac('sha256', secret)
		.update(value)
		.digest('base64url')
}

function safeEqual(a: string, b: string): boolean {
	const first = Buffer.from(a)
	const second = Buffer.from(b)

	if (first.length !== second.length) {
		return false
	}

	return timingSafeEqual(first, second)
}

export function verifyAdminPassword(password: string): boolean {
	const expected = process.env.ADMIN_PASSWORD

	if (!expected || !password) {
		return false
	}

	// Сравниваем хеши, чтобы длина пароля не влияла
	// на работу timingSafeEqual.
	const actualHash = createHmac('sha256', 'admin-password-check')
		.update(password)
		.digest('hex')

	const expectedHash = createHmac('sha256', 'admin-password-check')
		.update(expected)
		.digest('hex')

	return safeEqual(actualHash, expectedHash)
}

export async function createAdminSession(): Promise<void> {
	const secret = getSessionSecret()

	if (!secret) {
		throw new Error(
			'ADMIN_SESSION_SECRET должен содержать не менее 32 байт'
		)
	}

	const now = Math.floor(Date.now() / 1000)

	const payload: SessionPayload = {
		iat: now,
		exp: now + SESSION_DURATION,
		v: 1
	}

	const encodedPayload = Buffer.from(
		JSON.stringify(payload)
	).toString('base64url')

	const token = `${encodedPayload}.${sign(encodedPayload, secret)}`

	const cookieStore = await cookies()

	cookieStore.set(COOKIE_NAME, token, {
		httpOnly: true,
		secure: process.env.NODE_ENV === 'production',
		sameSite: 'lax',
		path: '/',
		maxAge: SESSION_DURATION
	})
}

export async function isAdminAuthenticated(): Promise<boolean> {
	const secret = getSessionSecret()

	if (!secret) {
		return false
	}

	const cookieStore = await cookies()
	const token = cookieStore.get(COOKIE_NAME)?.value

	if (!token) {
		return false
	}

	const parts = token.split('.')

	if (parts.length !== 2) {
		return false
	}

	const [encodedPayload, receivedSignature] = parts
	const expectedSignature = sign(encodedPayload, secret)

	if (!safeEqual(receivedSignature, expectedSignature)) {
		return false
	}

	try {
		const payload = JSON.parse(
			Buffer.from(encodedPayload, 'base64url').toString('utf8')
		) as SessionPayload

		const now = Math.floor(Date.now() / 1000)

		return (
			payload.v === 1 &&
			Number.isSafeInteger(payload.iat) &&
			Number.isSafeInteger(payload.exp) &&
			payload.iat <= now &&
			payload.exp > now &&
			payload.exp - payload.iat === SESSION_DURATION
		)
	} catch {
		return false
	}
}

export async function requireAdmin(): Promise<void> {
	if (!(await isAdminAuthenticated())) {
		redirect('/admin-login')
	}
}

export async function destroyAdminSession(): Promise<void> {
	const cookieStore = await cookies()

	cookieStore.delete(COOKIE_NAME)
}