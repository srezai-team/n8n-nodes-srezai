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
		description: 'Web access for AI agents: search, read, extract and research',
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
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				default: 'webSearch',
				options: [
					{
						name: 'Web Search',
						value: 'webSearch',
						action: 'Search the web',
						description: 'Search pages by a text query (1 credit)',
						routing: {
							request: {
								method: 'POST',
								url: '/api/v1/search',
							},
						},
					},
					{
						name: 'Image Search',
						value: 'imageSearch',
						action: 'Search for images',
						description: 'Search images by a text query (1 credit)',
						routing: {
							request: {
								method: 'POST',
								url: '/api/v1/media',
							},
						},
					},
					{
						name: 'Read URL',
						value: 'readUrl',
						action: 'Read a page as markdown',
						description: 'Fetch one page and return clean markdown text (1 credit)',
						routing: {
							request: {
								method: 'POST',
								url: '/api/v1/read',
							},
						},
					},
					{
						name: 'Extract',
						value: 'extract',
						action: 'Extract structured data from a page',
						description: 'Return JSON strictly following your schema (4 credits)',
						routing: {
							request: {
								method: 'POST',
								url: '/api/v1/extract',
							},
						},
					},
					{
						name: 'Fetch Page (Screenshot)',
						value: 'fetchPage',
						action: 'Screenshot a page and return text',
						description: 'Render a page and return a screenshot plus markdown (3 credits)',
						routing: {
							request: {
								method: 'POST',
								url: '/api/v1/fetch',
							},
						},
					},
					{
						name: 'Deep Research',
						value: 'deepResearch',
						action: 'Run multi step research',
						description: 'Reconcile many sources into a written answer (20+ credits)',
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
				displayName: 'Query',
				name: 'query',
				type: 'string',
				required: true,
				default: '',
				displayOptions: { show: { operation: ['webSearch', 'imageSearch', 'deepResearch'] } },
				routing: { send: { type: 'body', property: 'query' } },
				description: 'The search query or research topic',
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
				description: 'Full page URL (http/https)',
			},

			// ---------- extract schema ----------
			{
				displayName: 'Schema (JSON)',
				name: 'schema',
				type: 'json',
				required: true,
				default: '{\n  "title": "string",\n  "price": "number?"\n}',
				displayOptions: { show: { operation: ['extract'] } },
				routing: { send: { type: 'body', property: 'schema' } },
				description:
					'Result schema. Shorthand supported: {"title":"string","price":"number?"}. "?" = optional, "[]" = array.',
			},

			// ---------- optional fields ----------
			{
				displayName: 'Additional Options',
				name: 'additionalOptions',
				type: 'collection',
				placeholder: 'Add Option',
				default: {},
				displayOptions: {
					show: { operation: ['webSearch', 'imageSearch', 'readUrl', 'extract', 'fetchPage'] },
				},
				options: [
					{
						displayName: 'Number of Results',
						name: 'num',
						type: 'number',
						default: 10,
						displayOptions: { show: { '/operation': ['webSearch', 'imageSearch'] } },
						routing: { send: { type: 'body', property: 'num' } },
					},
					{
						displayName: 'Max Characters',
						name: 'maxChars',
						type: 'number',
						default: 4000,
						displayOptions: { show: { '/operation': ['readUrl', 'fetchPage'] } },
						routing: { send: { type: 'body', property: 'maxChars' } },
					},
					{
						displayName: 'Engine',
						name: 'engine',
						type: 'options',
						default: 'auto',
						options: [
							{ name: 'Auto', value: 'auto' },
							{ name: 'Fast', value: 'fast' },
							{ name: 'Dynamic', value: 'dynamic' },
							{ name: 'Stealth', value: 'stealth' },
						],
						displayOptions: { show: { '/operation': ['readUrl', 'extract'] } },
						routing: { send: { type: 'body', property: 'engine' } },
					},
					{
						displayName: 'Time Range',
						name: 'timeRange',
						type: 'options',
						default: 'all',
						options: [
							{ name: 'All', value: 'all' },
							{ name: 'Day', value: 'day' },
							{ name: 'Week', value: 'week' },
							{ name: 'Month', value: 'month' },
							{ name: 'Year', value: 'year' },
						],
						displayOptions: { show: { '/operation': ['webSearch', 'imageSearch'] } },
						routing: { send: { type: 'body', property: 'timeRange' } },
					},
					{
						displayName: 'Instruction',
						name: 'instruction',
						type: 'string',
						default: '',
						displayOptions: { show: { '/operation': ['extract'] } },
						routing: { send: { type: 'body', property: 'instruction' } },
						description: 'Parsing hint when the schema alone is ambiguous',
					},
				],
			},
		],
	};
}
