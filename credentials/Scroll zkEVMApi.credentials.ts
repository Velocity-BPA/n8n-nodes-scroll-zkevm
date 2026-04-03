import {
	ICredentialType,
	INodeProperties,
} from 'n8n-workflow';

export class ScrollzkEvmApi implements ICredentialType {
	name = 'scrollzkEvmApi';
	displayName = 'Scroll zkEVM API';
	documentationUrl = 'https://scrollscan.com/apis';
	properties: INodeProperties[] = [
		{
			displayName: 'API Key',
			name: 'apiKey',
			type: 'string',
			typeOptions: {
				password: true,
			},
			default: '',
			required: true,
			description: 'The API key for authenticating with Scroll zkEVM API',
		},
		{
			displayName: 'API Base URL',
			name: 'baseUrl',
			type: 'string',
			default: 'https://api.scrollscan.com/api',
			required: true,
			description: 'The base URL for the Scroll zkEVM API',
		},
	];
}