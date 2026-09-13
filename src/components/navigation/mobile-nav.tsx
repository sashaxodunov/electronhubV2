'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState } from 'react'

import { ChevronDown, ChevronRight, X } from 'lucide-react'

import { mainNavigation, secondaryNavigation } from '@/config/navigation'

type MobileNavProps = {
	trigger: React.ReactNode
}

function isActivePath(pathname: string, href: string) {
	if (href === '/') {
		return pathname === '/'
	}

	return pathname === href || pathname.startsWith(`${href}/`)
}

export function MobileNav({ trigger }: MobileNavProps) {
	const pathname = usePathname()

	const [open, setOpen] = useState(false)
	const [expanded, setExpanded] = useState<string | null>(null)

	const closeMenu = () => {
		setOpen(false)
		setExpanded(null)
	}

	const toggleExpanded = (href: string) => {
		setExpanded(current => (current === href ? null : href))
	}

	return (
		<>
			<button
				type='button'
				onClick={() => setOpen(true)}
				aria-label='Открыть меню'
			>
				{trigger}
			</button>

			{open && (
				<div className='fixed inset-0 `z-[100]` md:hidden'>
					{/* Overlay */}
					<button
						type='button'
						aria-label='Закрыть меню'
						className='absolute inset-0 bg-black/40'
						onClick={closeMenu}
					/>

					{/* Panel */}
					<aside className='absolute right-0 top-0 flex h-full w-[min(22rem,90vw)] flex-col border-l bg-background shadow-xl'>
						{/* Header */}
						<div className='flex h-16 items-center justify-between border-b px-4'>
							<Link
								href='/'
								onClick={closeMenu}
								className='font-bold tracking-tight'
							>
								<span className='text-xl'>
									Electron
									<span className='text-primary'>Hub</span>
								</span>
							</Link>

							<button
								type='button'
								onClick={closeMenu}
								className='inline-flex h-9 w-9 items-center justify-center rounded-md hover:bg-accent'
								aria-label='Закрыть меню'
							>
								<X className='h-5 w-5' />
							</button>
						</div>

						{/* Navigation */}
						<nav
							className='flex-1 overflow-y-auto px-3 py-4'
							aria-label='Мобильная навигация'
						>
							<div className='space-y-1'>
								{mainNavigation.map(item => {
									const active = isActivePath(pathname, item.href)

									const hasChildren = !!item.children?.length

									if (!hasChildren) {
										return (
											<Link
												key={item.href}
												href={item.href}
												onClick={closeMenu}
												className={[
													'flex items-center rounded-md px-3 py-3 text-sm font-medium',
													'hover:bg-accent',
													active ? 'bg-accent text-accent-foreground' : ''
												].join(' ')}
											>
												{item.title}
											</Link>
										)
									}

									const isExpanded = expanded === item.href

									return (
										<div key={item.href}>
											<div
												className={[
													'flex items-center rounded-md',
													active ? 'bg-accent/50' : ''
												].join(' ')}
											>
												<Link
													href={item.href}
													onClick={closeMenu}
													className='flex flex-1 items-center px-3 py-3 text-sm font-medium'
												>
													{item.title}
												</Link>

												<button
													type='button'
													onClick={() => toggleExpanded(item.href)}
													className='mr-1 inline-flex h-9 w-9 items-center justify-center rounded-md hover:bg-accent'
													aria-label={
														isExpanded
															? `Свернуть ${item.title}`
															: `Развернуть ${item.title}`
													}
												>
													{isExpanded ? (
														<ChevronDown className='h-4 w-4' />
													) : (
														<ChevronRight className='h-4 w-4' />
													)}
												</button>
											</div>

											{isExpanded && (
												<div className='ml-3 border-l pl-3'>
													{item.children?.map(child => {
														const childActive = isActivePath(
															pathname,
															child.href
														)

														return (
															<Link
																key={child.href}
																href={child.href}
																onClick={closeMenu}
																className={[
																	'block rounded-md px-3 py-2.5 text-sm',
																	'hover:bg-accent',
																	childActive
																		? 'bg-accent text-accent-foreground'
																		: 'text-muted-foreground'
																].join(' ')}
															>
																{child.title}
															</Link>
														)
													})}
												</div>
											)}
										</div>
									)
								})}
							</div>

							{/* Secondary */}
							<div className='my-5 border-t' />

							<div className='space-y-1'>
								{secondaryNavigation.map(item => {
									const active = isActivePath(pathname, item.href)

									return (
										<Link
											key={item.href}
											href={item.href}
											onClick={closeMenu}
											className={[
												'block rounded-md px-3 py-3 text-sm',
												'hover:bg-accent',
												active
													? 'bg-accent text-accent-foreground'
													: 'text-muted-foreground'
											].join(' ')}
										>
											{item.title}
										</Link>
									)
								})}
							</div>
						</nav>

						{/* Footer */}
						<div className='border-t p-4'>
							<p className='text-xs text-muted-foreground'>
								Электроника, схемы, даташиты и калькуляторы
							</p>
						</div>
					</aside>
				</div>
			)}
		</>
	)
}
