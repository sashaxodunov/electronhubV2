'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

const navigation = [
	{
		title: 'Обзор',
		href: '/admin',
		icon: '▦'
	},
	{
		title: 'Компоненты',
		href: '/admin/components',
		icon: '◈'
	},
	{
		title: 'Производители',
		href: '/admin/manufacturers',
		icon: '◎'
	},
	{
		title: 'Категории',
		href: '/admin/categories',
		icon: '◇'
	},
	{
		title: 'Серии',
		href: '/admin/series',
		icon: '≡'
	},
	{
		title: 'Корпуса',
		href: '/admin/packages',
		icon: '□'
	},
	{
		title: 'Применения',
		href: '/admin/applications',
		icon: '⌘'
	}
]

export default function AdminSidebar() {
	const pathname = usePathname()

	return (
		<aside className='fixed inset-y-0 left-0 z-40 hidden w-64 border-r border-zinc-200 bg-white lg:block dark:border-zinc-800 dark:bg-zinc-900'>
			<div className='flex h-full flex-col'>
				<div className='flex h-16 items-center border-b border-zinc-200 px-6 dark:border-zinc-800'>
					<Link
						href='/admin'
						className='flex items-center gap-3 font-semibold'
					>
						<span className='flex h-8 w-8 items-center justify-center rounded-lg bg-zinc-950 text-sm text-white dark:bg-white dark:text-zinc-950'>
							E
						</span>

						<span>ElectronHub</span>
					</Link>
				</div>

				<nav className='flex-1 space-y-1 overflow-y-auto p-4'>
					{navigation.map(item => {
						const isActive =
							item.href === '/admin'
								? pathname === '/admin'
								: pathname.startsWith(item.href)

						return (
							<Link
								key={item.href}
								href={item.href}
								className={[
									'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition',
									isActive
										? 'bg-zinc-100 text-zinc-950 dark:bg-zinc-800 dark:text-white'
										: 'text-zinc-600 hover:bg-zinc-100 hover:text-zinc-950 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-white'
								].join(' ')}
							>
								<span className='flex w-5 justify-center text-base'>
									{item.icon}
								</span>

								{item.title}
							</Link>
						)
					})}
				</nav>

				<div className='border-t border-zinc-200 p-4 dark:border-zinc-800'>
					<Link
						href='/'
						className='flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-zinc-600 transition hover:bg-zinc-100 hover:text-zinc-950 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-white'
					>
						<span className='flex w-5 justify-center'>←</span>
						Вернуться на сайт
					</Link>
				</div>
			</div>
		</aside>
	)
}
