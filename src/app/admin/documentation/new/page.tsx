import Link from 'next/link'

import DocumentationForm from '@/components/documentation/DocumentationForm'

export default function NewDocumentationPage() {
	return (
		<main className='mx-auto max-w-5xl space-y-6 p-6'>
			<div className='space-y-2'>
				<Link
					href='/admin/documentation'
					className='text-sm text-zinc-500 hover:text-zinc-900'
				>
					← К списку документации
				</Link>

				<h1 className='text-2xl font-semibold text-zinc-900'>Новый документ</h1>

				<p className='text-sm text-zinc-500'>
					Заполни информацию о документе. Файлы можно будет добавить следующим
					этапом.
				</p>
			</div>

			<section className='rounded-xl border border-zinc-200 bg-white p-6'>
				<DocumentationForm />
			</section>
		</main>
	)
}
