import prettier from 'eslint-config-prettier';
import path from 'node:path';
import { includeIgnoreFile } from '@eslint/compat';
import js from '@eslint/js';
import svelte from 'eslint-plugin-svelte';
import tailwindcss from 'eslint-plugin-tailwindcss';
import globals from 'globals';
import svelteConfig from './svelte.config.js';

const gitignorePath = path.resolve(import.meta.dirname, '.gitignore');

/** @type {import('eslint').Linter.Config[]} */ export default [
	includeIgnoreFile(gitignorePath),
	js.configs.recommended,
	...svelte.configs.recommended,
	...tailwindcss.configs['flat/recommended'],
	{
		// Tailwind v4 doesn't ship the legacy "resolveConfigPath" helper this plugin expects.
		// Setting an explicit config disables repeated warnings during lint runs.
		settings: {
			tailwindcss: {
				config: {}
			}
		}
	},
	prettier,
	...svelte.configs.prettier,
	{
		languageOptions: { globals: { ...globals.browser, ...globals.node } },
		rules: {
			'no-unused-vars': [
				'error',
				{
					argsIgnorePattern: '^_',
					varsIgnorePattern: '^_',
					caughtErrors: 'none'
				}
			]
		}
	},

	{
		files: ['**/*.svelte', '**/*.svelte.js'],
		languageOptions: { parserOptions: { svelteConfig } },
		rules: {
			// These rules are too strict/noisy for this project’s current Svelte patterns.
			'svelte/no-navigation-without-resolve': 'off',
			'svelte/prefer-svelte-reactivity': 'off',
			'svelte/no-reactive-literals': 'off',
			'svelte/no-immutable-reactive-statements': 'off',
			'svelte/no-reactive-reassign': 'off',
			'svelte/no-at-html-tags': 'off',

			// Tailwind plugin defaults are aimed at utility-only codebases.
			// This repo intentionally mixes Tailwind utilities with custom component classes.
			'tailwindcss/no-custom-classname': 'off',
			'tailwindcss/migration-from-tailwind-2': 'off'
		}
	}
];
