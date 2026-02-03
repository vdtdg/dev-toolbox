import adapterStatic from '@sveltejs/adapter-static';
import adapterNode from '@sveltejs/adapter-node';

const adapterName = process.env.SVELTEKIT_ADAPTER || 'static';
const isNode = adapterName === 'node';

const base = !isNode && process.env.BASE_PATH ? process.env.BASE_PATH.replace(/\/$/, '') : '';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	kit: {
		adapter: isNode ? adapterNode() : adapterStatic(),
		paths: {
			base,
			relative: true
		}
	}
};

export default config;
