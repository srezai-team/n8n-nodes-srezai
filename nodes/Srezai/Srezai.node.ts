import type { INodeType, INodeTypeDescription } from 'n8n-workflow';

/**
 * Declarative-style node for the srezai.ru web-access REST API.
 *
 * Endpoints and body fields mirror the official srezai SDK
 * (github.com/srezai-team/srezai-sdk). Base URL is https://srezai.ru and each
 * operation posts to /api/v1/<path>.
 *
 * Note: verify_claim and get_usage exist only over MCP, not REST, so they are
 * intentionally not exposed here. Quota is reported via X-RateLimit-* headers.
 */
export class Srezai implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'srezai',
		name: 'srezai',
		icon: 'file:node_logo.svg',
		group: ['transform'],
		version: 1,
		subtitle: '={{$parameter["operation"]}}',
		description: 'Доступ к вебу для AI-агентов: поиск, чтение, извлечение данных и исследование',
		defaults: {
			name: 'srezai',
		},
		inputs: ['main'],
		outputs: ['main'],
		usableAsTool: true,
		credentials: [
			{
				name: 'srezaiApi',
				required: true,
			},
		],
		requestDefaults: {
			baseURL: '={{$credentials.baseUrl}}',
			headers: {
				'Content-Type': 'application/json',
				Accept: 'application/json',
			},
		},
		properties: [
			{
				displayName: 'Операция',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				default: 'webSearch',
				options: [
					{
						name: 'Поиск в интернете',
						value: 'webSearch',
						action: 'Поиск в интернете',
						description: 'Поиск страниц по текстовому запросу (1 кредит)',
						routing: {
							request: {
								method: 'POST',
								url: '/api/v1/search',
							},
						},
					},
					{
						name: 'Поиск картинок',
						value: 'imageSearch',
						action: 'Поиск картинок',
						description: 'Поиск изображений по текстовому запросу (1 кредит)',
						routing: {
							request: {
								method: 'POST',
								url: '/api/v1/media',
							},
						},
					},
					{
						name: 'Прочитать страницу',
						value: 'readUrl',
						action: 'Прочитать страницу как markdown',
						description: 'Открыть одну страницу и вернуть чистый текст в markdown (1 кредит)',
						routing: {
							request: {
								method: 'POST',
								url: '/api/v1/read',
							},
						},
					},
					{
						name: 'Извлечь данные',
						value: 'extract',
						action: 'Извлечь структурированные данные со страницы',
						description: 'Вернуть JSON строго по вашей схеме (4 кредита)',
						routing: {
							request: {
								method: 'POST',
								url: '/api/v1/extract',
							},
						},
					},
					{
						name: 'Скриншот страницы',
						value: 'fetchPage',
						action: 'Сделать скриншот страницы и вернуть текст',
						description: 'Отрисовать страницу и вернуть скриншот и markdown (3 кредита)',
						routing: {
							request: {
								method: 'POST',
								url: '/api/v1/fetch',
							},
						},
					},
					{
						name: 'Глубокое исследование',
						value: 'deepResearch',
						action: 'Провести многошаговое исследование',
						description: 'Свести множество источников в готовый ответ (20+ кредитов)',
						routing: {
							request: {
								method: 'POST',
								url: '/api/v1/deep',
							},
						},
					},
				],
			},

			// ---------- query (search / image search / deep research) ----------
			{
				displayName: 'Запрос',
				name: 'query',
				type: 'string',
				required: true,
				default: '',
				displayOptions: { show: { operation: ['webSearch', 'imageSearch', 'deepResearch'] } },
				routing: { send: { type: 'body', property: 'query' } },
				description: 'Поисковый запрос или тема исследования',
			},

			// ---------- url (read / extract / fetch) ----------
			{
				displayName: 'URL',
				name: 'url',
				type: 'string',
				required: true,
				default: '',
				placeholder: 'https://example.com/article',
				displayOptions: { show: { operation: ['readUrl', 'extract', 'fetchPage'] } },
				routing: { send: { type: 'body', property: 'url' } },
				description: 'Полный URL страницы (http/https)',
			},

			// ---------- extract schema ----------
			{
				displayName: 'Схема (JSON)',
				name: 'schema',
				type: 'json',
				required: true,
				default: '{\n  "title": "string",\n  "price": "number?"\n}',
				displayOptions: { show: { operation: ['extract'] } },
				routing: { send: { type: 'body', property: 'schema' } },
				description:
					'Схема результата. Поддерживается сокращённая форма: {"title":"string","price":"number?"}. «?» — необязательное поле, «[]» — массив.',
			},

			// ---------- optional fields ----------
			{
				displayName: 'Дополнительные параметры',
				name: 'additionalOptions',
				type: 'collection',
				placeholder: 'Добавить параметр',
				default: {},
				displayOptions: {
					show: { operation: ['webSearch', 'imageSearch', 'readUrl', 'extract', 'fetchPage'] },
				},
				options: [
					{
						displayName: 'Количество результатов',
						name: 'num',
						type: 'number',
						default: 10,
						displayOptions: { show: { '/operation': ['webSearch', 'imageSearch'] } },
						routing: { send: { type: 'body', property: 'num' } },
					},
					{
						displayName: 'Максимум символов',
						name: 'maxChars',
						type: 'number',
						default: 4000,
						displayOptions: { show: { '/operation': ['readUrl', 'fetchPage'] } },
						routing: { send: { type: 'body', property: 'maxChars' } },
					},
					{
						displayName: 'Движок',
						name: 'engine',
						type: 'options',
						default: 'auto',
						options: [
							{ name: 'Авто', value: 'auto' },
							{ name: 'Быстрый', value: 'fast' },
							{ name: 'Динамический', value: 'dynamic' },
							{ name: 'Скрытный', value: 'stealth' },
						],
						displayOptions: { show: { '/operation': ['readUrl', 'extract'] } },
						routing: { send: { type: 'body', property: 'engine' } },
					},
					{
						displayName: 'Период',
						name: 'timeRange',
						type: 'options',
						default: 'all',
						options: [
							{ name: 'За всё время', value: 'all' },
							{ name: 'За день', value: 'day' },
							{ name: 'За неделю', value: 'week' },
							{ name: 'За месяц', value: 'month' },
							{ name: 'За год', value: 'year' },
						],
						displayOptions: { show: { '/operation': ['webSearch', 'imageSearch'] } },
						routing: { send: { type: 'body', property: 'timeRange' } },
					},
					{
						displayName: 'Инструкция',
						name: 'instruction',
						type: 'string',
						default: '',
						displayOptions: { show: { '/operation': ['extract'] } },
						routing: { send: { type: 'body', property: 'instruction' } },
						description: 'Подсказка для разбора, если из схемы неочевидно',
					},
				],
			},
		],
	};
}
