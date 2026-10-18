import { relationType } from '@/db/schema'

export type RelationType = (typeof relationType.enumValues)[number]

export const relationTypeLabels: Record<
	RelationType,
	{ label: string; description: string }
> = {
	equivalent: {
		label: 'Эквивалент',
		description: 'Функционально и электрически эквивалентный компонент.',
	},
	replacement: {
		label: 'Замена',
		description: 'Компонент, предназначенный для замены другого.',
	},
	alternative: {
		label: 'Альтернатива',
		description: 'Альтернативный вариант для той же или похожей задачи.',
	},
	compatible: {
		label: 'Совместимый компонент',
		description: 'Компонент, который может работать с исходным компонентом.',
	},
	similar: {
		label: 'Похожий компонент',
		description: 'Компонент со схожими характеристиками, но не обязательно взаимозаменяемый.',
	},
	contains: {
		label: 'Содержит',
		description: 'Устройство или компонент включает в себя другой компонент.',
	},
	related: {
		label: 'Связанный компонент',
		description: 'Связь по тематике или назначению.',
	},
}