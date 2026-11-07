
import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'

import { documentationCategories } from '@/config/categories'
import { getPublishedDocumentationByCategoryAndSlug } from '@/server/documentation/queries'
import { documentationStorageUrl } from '@/lib/storage'
import { getEquipmentByDocumentationId } from '@/server/equipment/queries'
import { getPublishedDocumentationByEquipmentIds } from '@/server/equipment/documentation-queries'

interface DocumentationPageProps {
  params: Promise<{
    categorySlug: string
    slug: string
  }>
}

export async function generateMetadata({
  params,
}: DocumentationPageProps): Promise<Metadata> {
  const { categorySlug, slug } = await params

  const category = documentationCategories.find(
    item => item.slug === categorySlug,
  )

  if (!category) {
    return { title: 'Документ не найден' }
  }

  const document = await getPublishedDocumentationByCategoryAndSlug(
    categorySlug,
    slug,
  )

  if (!document) {
    return { title: 'Документ не найден' }
  }

  return {
    title: `${document.title} — ${category.title}`,
    description:
      document.description ||
      `Принципиальная схема или техническая документация: ${document.title}.`,
  }
}

function formatFileSize(size: number): string {
  if (size < 1024) return `${size} Б`
  if (size < 1024 * 1024) return `${(size / 1024).toFixed(1)} КБ`
  if (size < 1024 * 1024 * 1024) {
    return `${(size / (1024 * 1024)).toFixed(1)} МБ`
  }

  return `${(size / (1024 * 1024 * 1024)).toFixed(2)} ГБ`
}

function formatDate(value: Date | string | null | undefined): string {
  if (!value) return ''

  const date = value instanceof Date ? value : new Date(value)

  if (Number.isNaN(date.getTime())) return ''

  return new Intl.DateTimeFormat('ru-RU', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    timeZone: 'Europe/Moscow',
  }).format(date)
}

function getDocumentTypeLabel(type: string): string {
  const labels: Record<string, string> = {
    schematic: 'Принципиальная схема',
    manual: 'Сервис-мануал',
    service_manual: 'Сервис-мануал',
    user_manual: 'Руководство пользователя',
    boardview: 'Boardview',
    datasheet: 'Техническая документация',
    firmware: 'Прошивка',
    other: 'Другой документ',
  }

  return labels[type] ?? 'Техническая документация'
}

export default async function DocumentationDetailPage({
  params,
}: DocumentationPageProps) {
  const { categorySlug, slug } = await params

  const category = documentationCategories.find(
    item => item.slug === categorySlug,
  )

  if (!category) notFound()

  const document = await getPublishedDocumentationByCategoryAndSlug(
    categorySlug,
    slug,
  )

  if (!document) notFound()

  const documentationId = BigInt(document.id)

  const equipmentItems = await getEquipmentByDocumentationId(documentationId)

  const relatedDocumentation =
    await getPublishedDocumentationByEquipmentIds(
      equipmentItems.map(item => item.id),
      documentationId,
    )

  const primaryFile =
    document.files.find(file => file.isPrimary) ?? document.files[0]

  return (
    <main className="mx-auto w-full max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
      <nav
        aria-label="Хлебные крошки"
        className="mb-8 flex flex-wrap items-center gap-y-2 text-sm text-zinc-500"
      >
        <Link href="/" className="transition hover:text-accent">
          Главная
        </Link>

        <span className="mx-2">/</span>

        <Link href="/documentation" className="transition hover:text-accent">
          Принципиальные схемы
        </Link>

        <span className="mx-2">/</span>

        <Link
          href={`/documentation/${category.slug}`}
          className="transition hover:text-accent"
        >
          {category.title}
        </Link>

        <span className="mx-2">/</span>

        <span className="text-zinc-900 dark:text-zinc-100">
          {document.title}
        </span>
      </nav>

      <header className="mb-8">
        <p className="mb-3 text-sm font-medium text-accent">
          {category.title}
        </p>

        <h1 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-white sm:text-4xl">
          {document.title}
        </h1>

        {document.description && (
          <p className="mt-5 whitespace-pre-line text-base leading-7 text-zinc-600 dark:text-zinc-400">
            {document.description}
          </p>
        )}

        <p className="mt-4 text-sm text-zinc-500">
          Обновлено: {formatDate(document.updatedAt)}
        </p>
      </header>

      {equipmentItems.length > 0 && (
        <section
          aria-labelledby="equipment-title"
          className="mb-8 space-y-6"
        >
          <h2
            id="equipment-title"
            className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-white"
          >
            Информация о приборе
          </h2>

          {equipmentItems.map(item => {
            const primaryImage =
              item.images.find(image => image.isPrimary) ?? item.images[0]

            const itemDocuments = relatedDocumentation.filter(
              relatedDocument => relatedDocument.equipmentId === item.id,
            )

            return (
              <article
                key={item.id.toString()}
                className="overflow-hidden rounded-2xl border border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900"
              >
                <div className="grid gap-6 p-5 sm:p-6 md:grid-cols-[240px_minmax(0,1fr)]">
                  {primaryImage ? (
                    <div>
                      <img
                        src={documentationStorageUrl(primaryImage.objectKey)}
                        alt={
                          primaryImage.alt ||
                          `${item.brandName ?? ''} ${item.model ?? item.title}`.trim()
                        }
                        className="aspect-square w-full rounded-xl border border-zinc-200 bg-zinc-50 object-contain dark:border-zinc-800 dark:bg-zinc-950"
                      />

                      {primaryImage.caption && (
                        <p className="mt-2 text-sm text-zinc-500">
                          {primaryImage.caption}
                        </p>
                      )}
                    </div>
                  ) : (
                    <div className="flex aspect-square items-center justify-center rounded-xl bg-zinc-100 text-sm text-zinc-500 dark:bg-zinc-800">
                      Фотография не добавлена
                    </div>
                  )}

                  <div className="min-w-0">
                    {item.brandName && (
                      <p className="text-sm font-medium text-accent">
                        {item.brandName}
                      </p>
                    )}

                    <h3 className="mt-1 wrap-break-word text-xl font-semibold text-zinc-900 dark:text-white">
                      {item.title}
                    </h3>

                    {item.model && (
                      <p className="mt-2 text-sm text-zinc-500">
                        Модель: {item.model}
                      </p>
                    )}

                    {item.description && (
                      <p className="mt-4 whitespace-pre-line text-sm leading-6 text-zinc-600 dark:text-zinc-400">
                        {item.description}
                      </p>
                    )}
                  </div>
                </div>

                {item.images.length > 1 && (
                  <div className="border-t border-zinc-200 p-5 dark:border-zinc-800 sm:p-6">
                    <h4 className="mb-3 font-semibold text-zinc-900 dark:text-white">
                      Фотографии прибора
                    </h4>

                    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
                      {item.images.map(image => (
                        <a
                          key={image.id.toString()}
                          href={documentationStorageUrl(image.objectKey)}
                          target="_blank"
                          rel="noreferrer"
                          className="group"
                        >
                          <img
                            src={documentationStorageUrl(image.objectKey)}
                            alt={image.alt || item.title}
                            loading="lazy"
                            className="aspect-square w-full rounded-lg border border-zinc-200 bg-zinc-50 object-contain transition group-hover:opacity-80 dark:border-zinc-800 dark:bg-zinc-950"
                          />

                          {image.caption && (
                            <span className="mt-2 block text-sm text-zinc-500">
                              {image.caption}
                            </span>
                          )}
                        </a>
                      ))}
                    </div>
                  </div>
                )}

                {item.parameters.length > 0 && (
                  <div className="border-t border-zinc-200 p-5 dark:border-zinc-800 sm:p-6">
                    <h4 className="mb-4 font-semibold text-zinc-900 dark:text-white">
                      Технические характеристики
                    </h4>

                    <dl className="divide-y divide-zinc-200 dark:divide-zinc-800">
                      {item.parameters.map(parameter => (
                        <div
                          key={parameter.id.toString()}
                          className="grid grid-cols-1 gap-1 py-3 sm:grid-cols-2 sm:gap-4"
                        >
                          <dt className="text-sm text-zinc-500">
                            {parameter.name}
                          </dt>

                          <dd className="wrap-break-word text-sm font-medium text-zinc-900 dark:text-zinc-100">
                            {parameter.value ?? '—'}
                            {parameter.unit ? ` ${parameter.unit}` : ''}
                          </dd>
                        </div>
                      ))}
                    </dl>
                  </div>
                )}

                {itemDocuments.length > 0 && (
                  <div className="border-t border-zinc-200 p-5 dark:border-zinc-800 sm:p-6">
                    <div className="mb-4 flex items-center justify-between gap-4">
                      <h4 className="font-semibold text-zinc-900 dark:text-white">
                        Вся документация по прибору
                      </h4>

                      <span className="text-sm text-zinc-500">
                        {itemDocuments.length}
                      </span>
                    </div>

                    <ul className="space-y-3">
                      {itemDocuments.map(relatedDocument => (
                        <li key={relatedDocument.id.toString()}>
                          <Link
                            href={`/documentation/${relatedDocument.categorySlug}/${relatedDocument.slug}`}
                            className="group flex flex-col gap-2 rounded-xl border border-zinc-200 p-4 transition hover:border-accent dark:border-zinc-800 sm:flex-row sm:items-center sm:justify-between"
                          >
                            <div className="min-w-0">
                              <span className="text-xs font-medium text-accent">
                                {getDocumentTypeLabel(
                                  relatedDocument.documentType,
                                )}
                              </span>

                              <p className="mt-1 font-medium text-zinc-900 group-hover:text-accent dark:text-white">
                                {relatedDocument.title}
                              </p>

                              {relatedDocument.description && (
                                <p className="mt-1 line-clamp-2 text-sm text-zinc-500">
                                  {relatedDocument.description}
                                </p>
                              )}

                              <p className="mt-2 text-xs text-zinc-500">
                                Обновлено:{' '}
                                {formatDate(relatedDocument.updatedAt)}
                              </p>
                            </div>

                            <span className="shrink-0 text-sm font-medium text-accent">
                              Открыть →
                            </span>
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </article>
            )
          })}
        </section>
      )}

      {primaryFile && (
        <section className="mb-8 rounded-2xl border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-900 sm:p-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="min-w-0">
              <p className="text-sm text-zinc-500">Основной файл</p>

              <h2 className="mt-1 wrap-break-word text-lg font-semibold text-zinc-900 dark:text-white">
                {primaryFile.originalName}
              </h2>

              <p className="mt-1 text-sm text-zinc-500">
                {primaryFile.contentType}
                {' · '}
                {formatFileSize(primaryFile.sizeBytes)}
              </p>
            </div>

            <a
              href={documentationStorageUrl(primaryFile.objectKey)}
              target="_blank"
              rel="noreferrer"
              className="inline-flex shrink-0 items-center justify-center rounded-lg bg-accent px-5 py-3 text-sm font-semibold text-white transition hover:opacity-90"
            >
              Открыть файл
            </a>
          </div>
        </section>
      )}

      <section aria-labelledby="document-files-title">
        <div className="mb-4 flex items-center justify-between gap-4">
          <h2
            id="document-files-title"
            className="text-xl font-semibold text-zinc-900 dark:text-white"
          >
            Файлы документа
          </h2>

          <span className="text-sm text-zinc-500">
            {document.files.length}
          </span>
        </div>

        {document.files.length === 0 ? (
          <div className="rounded-xl border border-dashed border-zinc-300 px-5 py-10 text-center dark:border-zinc-700">
            <p className="text-sm text-zinc-600 dark:text-zinc-400">
              Файлы для этого документа пока не добавлены.
            </p>
          </div>
        ) : (
          <ul className="space-y-3">
            {document.files.map(file => (
              <li key={file.id}>
                <div className="flex flex-col gap-3 rounded-xl border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-900 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex min-w-0 items-start gap-3">
                    <div className="flex size-11 shrink-0 items-center justify-center rounded-lg bg-zinc-100 text-xs font-bold text-zinc-600 dark:bg-zinc-800 dark:text-zinc-300">
                      {file.contentType === 'application/pdf' ? 'PDF' : 'FILE'}
                    </div>

                    <div className="min-w-0">
                      <p className="wrap-break-word font-medium text-zinc-900 dark:text-white">
                        {file.originalName}
                      </p>

                      <p className="mt-1 text-xs text-zinc-500">
                        {file.contentType}
                        {' · '}
                        {formatFileSize(file.sizeBytes)}
                        {file.isPrimary && (
                          <span className="ml-2 text-accent">Основной</span>
                        )}
                      </p>
                    </div>
                  </div>

                  <a
                    href={documentationStorageUrl(file.objectKey)}
                    target="_blank"
                    rel="noreferrer"
                    className="shrink-0 text-sm font-medium text-accent transition hover:opacity-80"
                  >
                    Открыть →
                  </a>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>

      <div className="mt-10 border-t border-zinc-200 pt-6 dark:border-zinc-800">
        <Link
          href={`/documentation/${category.slug}`}
          className="text-sm font-medium text-accent transition hover:opacity-80"
        >
          ← Вернуться в категорию
        </Link>
      </div>
    </main>
  )
}
