import { pgEnum } from 'drizzle-orm/pg-core'

export const assetType = pgEnum('asset_type', [
	'symbol', // условное графическое обозначение компонента на схеме
	'package', // тип корпуса и конструктивное исполнение компонента
	'photo', // фотография реального компонента/устройства
	'schematic', // принципиальная электрическая схема или фрагмент схемы
	'application_circuit', // типовая схема включения/применения
	'block_diagram', // структурная схема с функциональными блоками
	'graph', // график зависимости одного параметра от другого
	'table', // таблиц характеристик, параметров или значений
	'dimension', // размеры, габариты, расстояния и допуски
	'marking', // маркировка, обозначения на корпусе, кодировка выводов
	'other' // прочая информация
])

export const componentStatus = pgEnum('component_status', [
	'active', // используем сейчас
	'obsolete', // пробуем, еще не финальная версия
	'deprecated', // устарел, желательно заменить
	'preview' // использование прекращено
])

export const componentVariantStatus = pgEnum('component_variant_status', [
	'active',
	'obsolete',
	'deprecated'
])

export const documentType = pgEnum('document_type', [
	'datasheet', // техническое описание документа
	'application_note', // документ с рекомендациями и примерами практического применения компонента
	'reference_design', // эталонная схема конструкция для реализации устройства на основе компонента
	'manual', // руководство по эксплуатации, настройке или использованию устройства/компонента
	'errata', // список обнаруженных ошибок и исправлений в документации
	'other' // прочие документы
])

export const glossaryRelationType = pgEnum('glossary_relation_type', [
	'related',
	'synonym',
	'parent',
	'child',
	'abbreviation',
	'see_also'
])

export const packageMediaType = pgEnum('package_media_type', [
	'image',
	'svg',
	'drawing',
	'3d',
	'pdf',
	'datasheet',
	'model',

	'other'
])

export const pinType = pgEnum('pin_type', [
	'input',
	'output',
	'power',
	'ground',
	'io',
	'control',
	'passive',
	'nc'
])

export const relationType = pgEnum('relation_type', [
	'equivalent', // функциональное и электрически эквивалентные компоненты
	'replacement', // Компонент, предназначен для замены другого, обычно с совместимыми характеристиками
	'alternative', // альтернативный вариант для той же или похожей задачи
	'compatible', // совместимый компонент, который может работать вмести с исходным
	'similar', // похожий по характеристикам назначению или конструкции но не обязательно взаимозаменяемый
	'contains', // один компонент устройство содержит другой компонент устройство
	'related' // существует связь или тематическая взаимосвязь, но более конкретный тип отношения не определен
])
