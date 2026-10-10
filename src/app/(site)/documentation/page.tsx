
import type { Metadata } from 'next'
import Link from 'next/link'

import { documentationCategories } from '@/config/categories'

export const metadata: Metadata = {
  title: 'Принципиальные схемы и техническая документация',
  description:
    'Каталог принципиальных схем, электрических чертежей и технической документации для бытовой, компьютерной, автомобильной и промышленной электроники.',
}

export default function DocumentationPage() {
  return (
    <main className="mx-auto w-full max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <nav
        aria-label="Хлебные крошки"
        className="mb-8 text-sm text-zinc-500"
      >
        <Link href="/" className="transition hover:text-accent">
          Главная
        </Link>

        <span className="mx-2">/</span>

        <span className="text-zinc-900 dark:text-zinc-100">
          Принципиальные схемы
        </span>
      </nav>

      <header className="mb-10">
        <h1 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-white sm:text-4xl">
          Принципиальные схемы
        </h1>

        <p className="mt-4 max-w-3xl text-base leading-7 text-zinc-600 dark:text-zinc-400">
          Каталог электрических схем, сервисной документации и
          технических материалов для ремонта, изучения и
          проектирования электронных устройств.
        </p>
      </header>

      <section aria-label="Категории документации">
        <ul className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {documentationCategories.map((category) => (
            <li key={category.slug}>
              <Link
                href={`/documentation/${category.slug}`}
                className="group flex h-full flex-col rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm transition hover:-translate-y-0.5 hover:border-zinc-400 hover:shadow-md dark:border-zinc-800 dark:bg-zinc-900 dark:hover:border-zinc-600"
              >
                <h2 className="text-lg font-semibold text-zinc-900 transition group-hover:text-accent dark:text-white">
                  {category.title}
                </h2>

                <p className="mt-3 flex-1 text-sm leading-6 text-zinc-600 dark:text-zinc-400">
                  Принципиальные схемы и техническая документация:
                  {' '}
                  {category.title.toLowerCase()}.
                </p>

                <span className="mt-5 inline-flex items-center text-sm font-medium text-accent">
                  Перейти в категорию
                  <span className="ml-2 transition-transform group-hover:translate-x-1">
                    →
                  </span>
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </section>
    </main>
  )
}
