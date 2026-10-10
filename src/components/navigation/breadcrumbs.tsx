'use client'

import { ChevronRight, Home } from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

import { segmentLabels } from '@/config/breadcrumbs'

export type BreadcrumbItem = {
	label: string
	href?: string
}

type BreadcrumbsProps = {
	items?: BreadcrumbItem[]
}

function formatSegment(segment: string): string {
	const decoded = decodeURIComponent(segment)

	if (segmentLabels[decoded]) {
		return segmentLabels[decoded]
	}

	return decoded.replace(/-/g, ' ').replace(/\b\w/g, char => char.toUpperCase())
}

export default function Breadcrumbs({ items: customItems }: BreadcrumbsProps) {
	const pathname = usePathname()

	if (!pathname || pathname === '/') {
		return null
	}

	const segments = pathname.split('/').filter(Boolean)

	const items: BreadcrumbItem[] =
		customItems ??
		segments.map((segment, index) => ({
			label: formatSegment(segment),
			href: '/' + segments.slice(0, index + 1).join('/')
		}))

	return (
		<nav
			aria-label='Хлебные крошки'
			className='mt-10 p-5 w-full'
		>
			<ol className='flex items-center gap-1.5 overflow-hidden text-sm'>
				{/* Главная */}
				<li className='flex shrink-0 items-center'>
					<Link
						href='/'
						aria-label='Главная'
						className='flex items-center gap-1.5 text-zinc-500 transition-colors hover:text-zinc-950 dark:text-zinc-400 dark:hover:text-white'
					>
						<Home
							className='h-4 w-4'
							strokeWidth={1.8}
						/>

						<span className='hidden sm:inline'>Главная</span>
					</Link>
				</li>

				{/* Остальные уровни */}
				{items.map((item, index) => {
					const isLast = index === items.length - 1

					return (
						<li
							key={`${item.label}-${item.href ?? index}`}
							className='flex min-w-0 items-center gap-1.5'
						>
							<ChevronRight
								className='h-4 w-4 shrink-0 text-zinc-300 dark:text-zinc-700'
								strokeWidth={1.8}
							/>

							{isLast || !item.href ? (
								<span
									aria-current={isLast ? 'page' : undefined}
									className='truncate font-medium text-zinc-950 dark:text-white'
								>
									{item.label}
								</span>
							) : (
								<Link
									href={item.href}
									className='truncate text-zinc-500 transition-colors hover:text-zinc-950 dark:text-zinc-400 dark:hover:text-white'
								>
									{item.label}
								</Link>
							)}
						</li>
					)
				})}
			</ol>
		</nav>
	)
}
