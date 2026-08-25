const parser = require('@typescript-eslint/parser');
const n8nPlugin = require('eslint-plugin-n8n-nodes-base');

// Flat-config wrapper around eslint-plugin-n8n-nodes-base "community" ruleset.
module.exports = [
	{
		files: ['**/*.ts'],
		languageOptions: {
			parser,
			sourceType: 'module',
		},
		plugins: {
			'n8n-nodes-base': n8nPlugin,
		},
		rules: {
			...n8nPlugin.configs.community.rules,
		},
	},
	{
		files: ['package.json'],
		languageOptions: {
			parser: require('jsonc-eslint-parser'),
		},
		plugins: {
			'n8n-nodes-base': n8nPlugin,
		},
		rules: {
			...n8nPlugin.configs.community.rules,
		},
	},
];
