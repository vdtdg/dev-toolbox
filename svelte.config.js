import adapter from '@sveltejs/adapter-static';

const base = process.env.BASE_PATH ? process.env.BASE_PATH.replace(/\/$/, '') : '';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	kit: {
		adapter: adapter(),
		paths: {
			base
		}
	}
};

export default config;
