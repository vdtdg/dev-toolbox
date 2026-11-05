<script>
	import Seo from '$lib/components/Seo.svelte';
	import { tools } from '$lib/tools/catalog.js';

	import { base } from '$app/paths';

	const homeHref = base || '/';

	const tool = tools.find((entry) => entry.canonicalRoute === '/tools/vim-help/');
	const canonicalUrl = `https://dtdg.fr/dev-toolbox/tools/vim-help/`;
	const toolJsonLd = {
		'@context': 'https://schema.org',
		'@graph': [
			{
				'@type': 'WebApplication',
				name: tool.name,
				applicationCategory: 'DeveloperApplication',
				operatingSystem: 'Any',
				url: canonicalUrl,
				description: tool.seoDescription,
				keywords: tool.keywords.join(', '),
				offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' }
			},
			{
				'@type': 'BreadcrumbList',
				itemListElement: [
					{
						'@type': 'ListItem',
						position: 1,
						name: 'Dev Toolbox',
						item: 'https://dtdg.fr/dev-toolbox/'
					},
					{ '@type': 'ListItem', position: 2, name: tool.name, item: canonicalUrl }
				]
			}
		]
	};
</script>

<Seo
	title={tool.seoTitle}
	description={tool.seoDescription}
	{canonicalUrl}
	keywords={tool.keywords.join(', ')}
	jsonLd={toolJsonLd}
/>

<section class="panel space-y-3 p-5">
	<h2 class="text-lg font-semibold">About this tool</h2>
	<p class="text-sm text-(--color-muted)">{tool.description}</p>
	<dl class="grid gap-3 text-sm sm:grid-cols-2">
		<div>
			<dt class="font-medium">Input</dt>
			<dd class="text-(--color-muted)">{tool.inputDescription}</dd>
		</div>
		<div>
			<dt class="font-medium">Output</dt>
			<dd class="text-(--color-muted)">{tool.outputDescription}</dd>
		</div>
		<div>
			<dt class="font-medium">Use cases</dt>
			<dd class="text-(--color-muted)">{tool.useCases.join(' ')}</dd>
		</div>
		<div>
			<dt class="font-medium">Privacy</dt>
			<dd class="text-(--color-muted)">{tool.privacyDescription}</dd>
		</div>
	</dl>
</section>

<div class="min-h-screen">
	<div class="mx-auto flex max-w-250 flex-col gap-6 px-6 py-8">
		<header class="space-y-2">
			<a class="back-link" href={homeHref}>
				<span aria-hidden="true">←</span>
				Back to toolbox
			</a>
			<h1 class="text-3xl font-semibold">Help me I'm stuck in VIM !</h1>
			<p class="text-sm text-(--color-muted)">Don't panic.</p>
		</header>

		<section class="panel space-y-5 p-6">
			<div class="panel panel-muted space-y-4 p-5">
				<p class="text-sm">
					Just press <span class="keycap">Esc</span> a couple of times, and then:
				</p>
				<div class="space-y-3 text-sm">
					<p>
						Save: type <span class="keycap">:w</span> then press <span class="keycap">Enter</span>
					</p>
					<p>
						Save and quit: type <span class="keycap">:wq</span> or press
						<span class="keycap">ZZ</span>
					</p>
					<p>Quit without saving: type <span class="keycap">:q!</span></p>
				</div>
			</div>

			<div class="panel panel-muted p-5 text-sm">
				If you want a good tutorial, type <span class="keycap">vimtutor</span> in your terminal.
			</div>
		</section>
	</div>
</div>
