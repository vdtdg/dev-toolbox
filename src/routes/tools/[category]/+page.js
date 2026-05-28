import { error } from '@sveltejs/kit';
import { categories, tools } from '$lib/tools/catalog.js';

const toolCategories = categories.filter((category) => category.id !== 'all');

export const entries = () => toolCategories.map((category) => ({ category: category.id }));

export const load = ({ params }) => {
	const category = toolCategories.find((item) => item.id === params.category);
	if (!category) error(404, 'Category not found');

	return {
		category,
		categoryTools: tools.filter((tool) => tool.category === category.id)
	};
};
