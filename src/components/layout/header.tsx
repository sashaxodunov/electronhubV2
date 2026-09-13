import Link from 'next/link'

import { MainNav } from '@/components/navigation/main-nav'
import { MobileNav } from '@/components/navigation/mobile-nav'
import Logo from '@/components/ui/Logo'
import Button from '@/components/ui/button'
import { Menu, Search } from 'lucide-react'

export function Header() {
	return (
		<header className='header mx-auto sticky top-0 z-50 w-full border-b border-amber-100'>
			<div className='mx-auto rounded-xl flex min-h-20 max-[750px]:min-h-18 max-[370px]:min-h-16 w-full max-w-333 items-center justify-between px-4 bg-gray-600/90'>
				{/* Logo */}
				<div className='mr-6 flex shrink-0'>
					<Logo />
					<Link
						href='/'
						className='flex items-center gap-2 px-2 tracking-tight text-accent	transition-colors	duration-200	hover:text-accent-hover'
						aria-label='ElectronHub — главная'
					>
						<span className='text-xl max-[380px]:hidden'>
							Electron<span className='text-primary'>Hub</span>
						</span>
					</Link>
				</div>

				{/* Desktop navigation */}
				<div className='hidden md:flex md:flex-1'>
					<MainNav />
				</div>

				{/* Right side */}
				<div className='ml-auto flex items-center gap-2'>
					<Link
						href='/search'
						className='inline-flex h-9 items-center justify-center rounded-md hover:bg-accent hover:text-accent-foreground'
						aria-label='Поиск'
					>
						<Button
							aria-label='Поиск'
							className='hidden md:flex gap-2'
						>
							<span>Поиск</span>
							<Search />
						</Button>
					</Link>

					{/* <Link
						href='/search'
						className='inline-flex h-9 w-9 items-center justify-center rounded-md hover:bg-accent hover:text-accent-foreground'
						aria-label='Поиск'
					>
						<Search className='h-5 w-5' />
					</Link> */}

					{/* Mobile menu */}
					<div className='md:hidden'>
						<MobileNav
							trigger={
								<span className='inline-flex h-9 w-9 items-center justify-center rounded-md hover:bg-accent hover:text-accent-foreground'>
									<Menu className='h-5 w-5' />
									<span className='sr-only'>Открыть меню</span>
								</span>
							}
						/>
					</div>
				</div>
			</div>
		</header>
	)
}
