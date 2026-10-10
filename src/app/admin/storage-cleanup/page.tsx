import { desc } from 'drizzle-orm'

import { retryDatasheetCleanup } from '@/actions/datasheets'
import { db } from '@/db'
import { datasheetStorageCleanup } from '@/db/schema'

export const dynamic = 'force-dynamic'

export default async function StorageCleanupPage() {
	const jobs = await db
		.select()
		.from(datasheetStorageCleanup)
		.orderBy(desc(datasheetStorageCleanup.createdAt))

	return (
		<div className='mx-auto max-w-5xl space-y-6'>
			<div>
				<h1 className='text-2xl font-semibold'>Очистка хранилища</h1>
				<p className='mt-1 text-sm text-gray-500'>
					Файлы, которые не удалось удалить автоматически.
				</p>
			</div>

			{jobs.length === 0 ? (
				<div className='rounded-xl border border-dashed border-gray-300 p-8 text-center text-sm text-gray-500'>
					Очередь очистки пуста.
				</div>
			) : (
				<div className='space-y-4'>
					{jobs.map(job => (
						<article
							key={job.id.toString()}
							className='rounded-xl border border-gray-200 bg-white p-5'
						>
							<p className='break-all font-mono text-sm'>{job.objectKey}</p>

							<p className='mt-2 text-sm text-gray-500'>
								Попыток: {job.attempts}
							</p>

							{job.lastError && (
								<p className='mt-2 break-words text-sm text-red-700'>
									{job.lastError}
								</p>
							)}

							<form
								action={retryDatasheetCleanup}
								className='mt-4'
							>
								<input
									type='hidden'
									name='jobId'
									value={job.id.toString()}
								/>
								<button
									type='submit'
									className='rounded-lg bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:bg-gray-800'
								>
									Повторить удаление
								</button>
							</form>
						</article>
					))}
				</div>
			)}
		</div>
	)
}
