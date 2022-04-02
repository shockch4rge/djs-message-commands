import { defineUserConfig } from "vuepress";

import config from "../../package.json";


import type { DefaultThemeOptions } from "vuepress";

export default defineUserConfig<DefaultThemeOptions>({
	title: `${config.name} v${config.version}`,
	description: `${config.description}`,

	/** Site config */
	base: "/djs-message-commands/",

	themeConfig: {
		repo: `${config.homepage}`,
		editLinks: false,
		smoothScroll: true,
		searchPlaceholder: "Search",
		navbar: [
			{
				text: "Guide",
				link: "/guide/overview.md",
			},
			{
				text: "References",
				link: "/references/MessageCommandBuilder.md",
			},
		],
		sidebarDepth: 3,
		sidebar: [
			{
				text: "Guide",
				children: [
					{
						text: "Overview",
						link: "/guide/overview.html",
					},
					{
						text: "Usage",
						link: "/guide/usage.html",
					},
					{
						text: "Tips",
						link: "/guide/tips.html",
					}
				],
			},
			{
				text: "References",
				children: [
					{
						text: "MessageCommandBuilder",
						link: "/references/MessageCommandBuilder.html",
					},
					{
						text: "MessageCommandBuilderData",
						link: "/references/MessageCommandBuilderData.html",
					},
					{
						text: "MessageCommandOption",
						link: "/references/MessageCommandOption.html",
					},
					{
						text: "MessageCommandOptionData",
						link: "/references/MessageCommandOptionData.html",
					},
					{
						text: "MessageCommandStringOption",
						link: "/references/MessageCommandStringOption.html",
					},
					{
						text: "MessageCommandNumberOption",
						link: "/references/MessageCommandNumberOption.html",
					},
					{
						text: "MessageCommandBooleanOption",
						link: "/references/MessageCommandBooleanOption.html",
					},
					{
						text: "MessageCommandMemberOption",
						link: "/references/MessageCommandMemberOption.html",
					},
					{
						text: "MessageCommandChannelOption",
						link: "/references/MessageCommandChannelOption.html",
					},
					{
						text: "MessageCommandRoleOption",
						link: "/references/MessageCommandRoleOption.html",
					},
					{
						text: "MessageCommandOptionChoice",
						link: "/references/MessageCommandOptionChoice.html",
					},
					{
						text: "MessageCommandOptionChoiceable",
						link: "/references/MessageCommandOptionChoiceable.html",
					},
				],
			},
		],
	},
});
