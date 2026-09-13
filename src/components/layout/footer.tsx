import { footerNavigation } from '@/config/navigation'
import { siteConfig } from '@/config/site'
import Image from 'next/image'
import Link from 'next/link'

export function Footer() {
	return (
		<footer className='border-t bg-muted/30'>
			<div className='container mx-auto px-4'>
				{/* Main footer */}
				<div className='grid gap-8 py-10 sm:grid-cols-2 lg:grid-cols-4'>
					{/* Brand */}
					<div>
						<Link
							href='/'
							className='inline-block font-bold tracking-tight'
						>
							<span className='text-xl'>
								Electron
								<span className='text-primary'>Hub</span>
							</span>
						</Link>

						<p className='mt-3 max-w-xs text-sm leading-6 text-muted-foreground'>
							{siteConfig.description}
						</p>
					</div>

					{/* Resources */}
					<div>
						<h2 className='text-sm font-semibold'>Ресурсы</h2>

						<ul className='mt-4 space-y-2'>
							{footerNavigation.resources.map(item => (
								<li key={item.href}>
									<Link
										href={item.href}
										className='text-sm text-muted-foreground transition-colors hover:text-foreground'
									>
										{item.title}
									</Link>
								</li>
							))}
						</ul>
					</div>

					{/* Tools */}
					<div>
						<h2 className='text-sm font-semibold'>Инструменты</h2>

						<ul className='mt-4 space-y-2'>
							{footerNavigation.tools.map(item => (
								<li key={item.href}>
									<Link
										href={item.href}
										className='text-sm text-muted-foreground transition-colors hover:text-foreground'
									>
										{item.title}
									</Link>
								</li>
							))}
						</ul>
					</div>

					{/* Information */}
					<div>
						<h2 className='text-sm font-semibold'>Информация</h2>

						<ul className='mt-4 space-y-2'>
							{footerNavigation.information.map(item => (
								<li key={item.href}>
									<Link
										href={item.href}
										className='text-sm text-muted-foreground transition-colors hover:text-foreground'
									>
										{item.title}
									</Link>
								</li>
							))}
						</ul>
					</div>
				</div>

				<div className='flex justify-between border-t px-4'>
					<ul className='flex gap-7.5 min-[601px]:gap-x-12.5 pt-6'>
						<li>
							<Link
								href='#!'
								aria-label='VK'
								className='transition-colors hover:text-accent'
							>
								<Image
									src='/images/home/vk.svg'
									alt='VK'
									width={32}
									height={32}
								/>
							</Link>
						</li>

						<li>
							<Link
								href='#!'
								aria-label='Rutube'
								className='transition-colors hover:text-accent'
							>
								<Image
									src='/images/home/rutube.svg'
									alt='Rutube'
									width={32}
									height={32}
								/>
							</Link>
						</li>

						<li>
							<Link
								href='#!'
								aria-label='Telegram'
								className='transition-colors hover:text-accent'
							>
								<Image
									src='/images/home/telegram.svg'
									alt='Telegram'
									width={32}
									height={32}
								/>
							</Link>
						</li>

						<li>
							<Link
								href='#!'
								aria-label='Dzen'
								className='transition-colors hover:text-accent'
							>
								<Image
									src='/images/home/dzen.svg'
									alt='Dzen'
									width={32}
									height={32}
								/>
							</Link>
						</li>
					</ul>

					<div className='flex flex-col gap-y-5 text-sm leading-loose min-[601px]:flex-row min-[601px]:gap-x-12.5 pt-3 pb-4'>
						<div>
							<address className='not-italic'>
								188401 Россия г.Санкт-Петербург, Волосовский р-он, п.Калитино
							</address>

							<p>
								Email:{' '}
								<a
									href='mailto:sasha@xodunov.ru'
									className='transition-colors hover:text-accent'
								>
									sasha@xodunov.ru
								</a>
							</p>
						</div>
					</div>
				</div>

				{/* Bottom */}
				<div className='flex flex-col gap-3 border-t py-6 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between'>
					<p>
						© {new Date().getFullYear()} {siteConfig.name}. Все права защищены.
					</p>
					<div className='min-[601px]:ml-auto'>
						<a
							href='https://datasheet.su/'
							target='_blank'
							rel='noopener noreferrer'
							className='inline-block p-0 transition-colors hover:text-accent'
						>
							<Image
								src='/images/datasheet-su.gif'
								alt='Datasheet.su'
								width={81}
								height={31}
							/>
						</a>
					</div>
				</div>
			</div>
		</footer>
	)
}
