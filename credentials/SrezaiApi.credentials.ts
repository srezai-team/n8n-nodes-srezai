import type {
	IAuthenticateGeneric,
	ICredentialTestRequest,
	ICredentialType,
	INodeProperties,
} from 'n8n-workflow';

export class SrezaiApi implements ICredentialType {
	name = 'srezaiApi';

	displayName = 'srezai API';

	documentationUrl = 'https://srezai.ru/docs';

	properties: INodeProperties[] = [
		{
			displayName: 'API Key',
			name: 'apiKey',
			type: 'string',
			typeOptions: { password: true },
			default: '',
			required: true,
			description: 'Your srezai.ru API key. Sent as a Bearer token.',
		},
		{
			displayName: 'Base URL',
			name: 'baseUrl',
			type: 'string',
			default: 'https://srezai.ru',
			required: true,
			description: 'Base URL of the srezai API. Change only for staging or an isolated deployment.',
		},
	];

	// Injects the API key as a Bearer token on every request.
	authenticate: IAuthenticateGeneric = {
		type: 'generic',
		properties: {
			headers: {
				Authorization: '=Bearer {{$credentials.apiKey}}',
			},
		},
	};

	// Validates the key with a minimal, cheap search request (1 credit).
	// srezai has no free REST endpoint for key checks.
	test: ICredentialTestRequest = {
		request: {
			baseURL: '={{$credentials.baseUrl}}',
			url: '/api/v1/search',
			method: 'POST',
			body: {
				query: 'ping',
				num: 1,
			},
		},
	};
}
