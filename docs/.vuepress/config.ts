import { defineConfig } from 'vuepress/config';

import config from '../../package.json';

export default defineConfig({
	title: config.name,
	description: config.description,
	themeConfig: {
		repo: "https://github.com/Shockch4rge/djs-message-commands",
		editLinks: false,
		navbar: true,
		nav: [
			{
				text: "Guide",
				link: "/guide/",
			},
		],
		sidebar: {
			guide: [
				{
					title: "Guide",
					collapsable: false,
				},
			],
		},
	},
});
