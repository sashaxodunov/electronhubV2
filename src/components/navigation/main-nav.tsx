'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

import { ChevronDown } from 'lucide-react'

import { mainNavigation, type NavigationItem } from '@/config/navigation'

function isActivePath(pathname: string, href: string) {
	if (href === '/') {
		return pathname === '/'
	}

	return pathname === href || pathname.startsWith(`${href}/`)
}

function NavItem({ item }: { item: NavigationItem }) {
	const pathname = usePathname()
	const active = isActivePath(pathname, item.href)

	if (!item.children?.length) {
		return (
			<Link
				href={item.href}
				className={[
					'relative inline-flex h-10 items-center rounded-md px-3 text-sm font-medium',
					'transition-colors hover:bg-accent hover:text-accent-foreground',
					active ? 'text-foreground' : 'text-muted-foreground'
				].join(' ')}
			>
				{item.title}

				{active && (
					<span className='absolute inset-x-2 `-bottom-[1px]` h-0.5 rounded-full bg-primary' />
				)}
			</Link>
		)
	}

	return (
		<div className='group relative'>
			<Link
				href={item.href}
				className={[
					'inline-flex h-10 items-center gap-1 rounded-md px-3 text-sm font-medium',
					'transition-colors hover:bg-accent hover:text-black',
					active ? 'text-foreground' : 'text-muted-foreground'
				].join(' ')}
			>
				{item.title}

				<ChevronDown className='h-4 w-4 transition-transform group-hover:rotate-180' />
			</Link>

			{/* Dropdown */}
			<div className='invisible absolute left-0 top-full z-50 w-72 translate-y-2 rounded-lg border bg-background-light p-2 opacity-0 shadow-lg transition-all duration-150 group-hover:visible group-hover:translate-y-0 group-hover:opacity-100'>
				{item.description && (
					<div className='px-3 py-2'>
						<p className='text-xs text-muted-foreground'>{item.description}</p>
					</div>
				)}

				{item.children.map(child => {
					const childActive = isActivePath(pathname, child.href)

					return (
						<Link
							key={child.href}
							href={child.href}
							className={[
								'block rounded-md px-3 py-2.5',
								'transition-colors hover:bg-accent hover:text-black',
								childActive ? 'bg-accent text-accent-foreground' : ''
							].join(' ')}
						>
							<div className='text-sm font-medium'>{child.title}</div>

							{child.description && (
								<div className='mt-0.5 text-xs text-muted-foreground'>
									{child.description}
								</div>
							)}
						</Link>
					)
				})}
			</div>
		</div>
	)
}

export function MainNav() {
	return (
		<nav
			className='flex items-center gap-1'
			aria-label='Основная навигация'
		>
			{mainNavigation.map(item => (
				<NavItem
					key={item.href}
					item={item}
				/>
			))}
		</nav>
	)
}
