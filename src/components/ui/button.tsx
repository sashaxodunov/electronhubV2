import clsx from 'clsx'
import type { ReactNode } from 'react'

type ButtonProps = {
	className?: string
	type?: 'button' | 'submit' | 'reset'
	href?: string
	children?: ReactNode
}

const Button = (props: ButtonProps) => {
	const { className, type = 'button', href, children } = props

	const isLink = href !== undefined
	const Component = isLink ? 'a' : 'button'
	const attributesByTag = isLink ? { href } : { type }

	return (
		<Component
			className={clsx(
				'inline-flex items-center gap-x-[0.3em] px-2.5 py-1.5 bg-accent rounded-lg border-2 border-black text-[14px] text-black leading-none transition-colors duration-200 ease-in hover:bg-[#fcc54e]',
				className
			)}
			{...attributesByTag}
		>
			{children}
		</Component>
	)
}

Button.displayName = 'Button'

export default Button
