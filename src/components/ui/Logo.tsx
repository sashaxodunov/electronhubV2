import clsx from 'clsx'
import Image from 'next/image'
import Link from 'next/link'

type LogoProps = {
	className?: string
	loading?: 'lazy' | 'eager'
}

function Logo({ className, loading = 'eager' }: LogoProps) {
	const title = 'Главная'

	return (
		<Link
			className={clsx('w-[clamp(40px,12vw,50px)]', className)}
			href='/'
			title={title}
			aria-label={title}
		>
			<Image
				className='h-auto w-full'
				src='/images/home/logo.png'
				alt=''
				width={50}
				height={50}
				loading={loading}
			/>
		</Link>
	)
}

export default Logo
