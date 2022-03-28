import { defineConfig } from "vuepress/config";

import config from "../../package.json";


export default defineConfig({
	title: `${config.name} v${config.version}`,
	description: `${config.description}`,
	themeConfig: {
		repo: "https://github.com/Shockch4rge/djs-message-commands",
		editLinks: false,
		smoothScroll: true,
		searchPlaceholder: "Search",
		navbar: true,
		nav: [
			{
				text: "Guide",
				link: "/guide/Overview.md",
			},
			{
				text: "References",
				link: "/references/MessageCommandBuilder.md",
			},
		],
		sidebarDepth: 3,
		sidebar: [
			{
				title: "Guide",
				children: ["/guide/Overview.md", "/guide/Usage.md"],
			},
			{
				title: "References",
				children: [
					"/references/MessageCommandBuilder.md",
					"/references/MessageCommandBuilderData.md",
					"/references/MessageCommandOption.md",
					"/references/MessageCommandOptionType.md",
					"/references/MessageCommandStringOption.md",
					"/references/MessageCommandNumberOption.md",
					"/references/MessageCommandOptionChoice.md",
					"/references/MessageCommandOptionChoiceable.md",
				],
			},
		],
	},
});
