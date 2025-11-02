const fs = require("fs-extra");
const axios = require("axios");
const path = require("path");
const { getPrefix } = global.utils;
const { commands, aliases } = global.GoatBot;
const doNotDelete = "[ 🐐 | Goat Bot V2 ]";
/**
* @author NTKhang
* @modified BrayanPrince (v2 - Emoji Help UI)
*/

module.exports = {
	config: {
		name: "help",
		version: "1.40",
		author: "NTKhang (modifié par BrayanPrince)",
		countDown: 5,
		role: 0,
		description: {
			vi: "Xem cách sử dụng của các lệnh",
			en: "View command usage"
		},
		category: "info",
		guide: {
			vi: "   {pn} [để trống | <số trang> | <tên lệnh>]",
			en: "   {pn} [empty | <page number> | <command name>]"
		},
		priority: 1
	},

	langs: {
		vi: {
			commandNotFound: "Lệnh \"%1\" không tồn tại",
			pageNotFound: "Trang %1 không tồn tại",
			doNotHave: "Không có",
			roleText0: "0 (Tất cả người dùng)",
			roleText1: "1 (Quản trị viên nhóm)",
			roleText2: "2 (Admin bot)",
			roleText0setRole: "0 (set role, tất cả người dùng)",
			roleText1setRole: "1 (set role, quản trị viên nhóm)"
		},
		en: {
			commandNotFound: "Command \"%1\" does not exist",
			pageNotFound: "Page %1 does not exist",
			doNotHave: "Do not have",
			roleText0: "0 (All users)",
			roleText1: "1 (Group administrators)",
			roleText2: "2 (Admin bot)",
			roleText0setRole: "0 (set role, all users)",
			roleText1setRole: "1 (set role, group administrators)"
		}
	},

	onStart: async function ({ message, args, event, threadsData, getLang, role, globalData }) {
		const langCode = await threadsData.get(event.threadID, "data.lang") || global.GoatBot.config.language;
		let customLang = {};
		const pathCustomLang = path.normalize(`${process.cwd()}/languages/cmds/${langCode}.js`);
		if (fs.existsSync(pathCustomLang))
			customLang = require(pathCustomLang);

		const { threadID } = event;
		const threadData = await threadsData.get(threadID);
		const prefix = getPrefix(threadID);

		const commandName = (args[0] || "").toLowerCase();
		let command = commands.get(commandName) || commands.get(aliases.get(commandName));
		const aliasesData = threadData.data.aliases || {};

		if (!command) {
			for (const cmdName in aliasesData) {
				if (aliasesData[cmdName].includes(commandName)) {
					command = commands.get(cmdName);
					break;
				}
			}
		}

		if (!command) {
			const globalAliasesData = await globalData.get('setalias', 'data', []);
			for (const item of globalAliasesData) {
				if (item.aliases.includes(commandName)) {
					command = commands.get(item.commandName);
					break;
				}
			}
		}

		// ———————————————— LIST ALL COMMANDS ——————————————— //
		if (!command && (!args[0] || !isNaN(args[0]))) {
			let msg = "";
			const page = parseInt(args[0]) || 1;
			const numberOfOnePage = 25;

			// 🧩 Liste d’emojis pour les catégories
			const categoryIcons = {
				"INFO": "💬",
				"FUN": "🎮",
				"MEDIA": "🖼️",
				"ADMIN": "🛠️",
				"OWNER": "👑",
				"GROUP": "👥",
				"ECONOMY": "💰",
				"UTILITY": "⚙️",
				"ANIME": "🍥",
				"MUSIC": "🎵",
				"GAME": "🎯",
				"RANDOM": "🍂",
				"NO CATEGORY": "📦"
			};

			const categorized = {};
			for (const [name, value] of commands) {
				if (value.config.role > 1 && role < value.config.role) continue;

				const category = (value.config.category || "No Category").toUpperCase();
				const description = checkLangObject(value.config.description, langCode) || "";
				const shortDesc = cropContent(description.charAt(0).toUpperCase() + description.slice(1), 50);
				const line = `│ ${name.padEnd(15)} → ${shortDesc}`;

				if (!categorized[category]) categorized[category] = [];
				categorized[category].push(line);
			}

			const allCategories = Object.keys(categorized).sort();
			allCategories.forEach((cat, idx) => {
				const icon = categoryIcons[cat] || "📁";
				msg += `${idx == 0 ? "╭" : "├"}───「 ${icon} ${cat} 」───⭓\n`;
				categorized[cat].sort();
				msg += categorized[cat].join("\n") + "\n";
			});

			// Pagination
			const lines = msg.trim().split("\n");
			const totalPage = Math.ceil(lines.length / numberOfOnePage);
			if (page < 1 || page > totalPage)
				return message.reply(getLang("pageNotFound", page));

			const pageContent = lines.slice((page - 1) * numberOfOnePage, page * numberOfOnePage).join("\n");
			const footer = `\n├─────⭔\n│ Page [ ${page}/${totalPage} ]\n│ ${commands.size} commandes disponibles\n│ Utilise: ${prefix}help <page>\n╰─────────────⭓`;

			return message.reply(`╭─────────────⭓\n${pageContent}${footer}`);
		}

		// ———————————— COMMAND DOES NOT EXIST ———————————— //
		else if (!command && args[0]) {
			return message.reply(getLang("commandNotFound", args[0]));
		}

		// ————————————————— INFO COMMAND ————————————————— //
		else {
			const configCommand = command.config;
			let guide = configCommand.guide?.[langCode] || configCommand.guide?.["en"];
			if (guide == undefined)
				guide = customLang[configCommand.name]?.guide?.[langCode] || customLang[configCommand.name]?.guide?.["en"];

			guide = guide || { body: "" };
			if (typeof guide == "string")
				guide = { body: guide };

			const guideBody = guide.body
				.replace(/\{prefix\}|\{p\}/g, prefix)
				.replace(/\{name\}|\{n\}/g, configCommand.name)
				.replace(/\{pn\}/g, prefix + configCommand.name);

			const aliasesString = configCommand.aliases ? configCommand.aliases.join(", ") : getLang("doNotHave");
			const aliasesThisGroup = threadData.data.aliases ? (threadData.data.aliases[configCommand.name] || []).join(", ") : getLang("doNotHave");

			let roleOfCommand = configCommand.role;
			let roleIsSet = false;
			if (threadData.data.setRole?.[configCommand.name]) {
				roleOfCommand = threadData.data.setRole[configCommand.name];
				roleIsSet = true;
			}

			const roleText = roleOfCommand == 0 ?
				(roleIsSet ? getLang("roleText0setRole") : getLang("roleText0")) :
				roleOfCommand == 1 ?
					(roleIsSet ? getLang("roleText1setRole") : getLang("roleText1")) :
					getLang("roleText2");

			const author = configCommand.author;
			const descriptionCustomLang = customLang[configCommand.name]?.description;
			let description = checkLangObject(configCommand.description, langCode);
			if (description == undefined)
				if (descriptionCustomLang != undefined)
					description = checkLangObject(descriptionCustomLang, langCode);
				else
					description = getLang("doNotHave");

			const guideMsg =
				`╭───「 ${configCommand.name.toUpperCase()} 」───⭓\n` +
				`│🌸 Description: ${description}\n` +
				`│🌸 Aliases: ${aliasesString}\n` +
				`│🌸 Group Aliases: ${aliasesThisGroup}\n` +
				`│🌸 Version: ${configCommand.version}\n` +
				`│🌸 Role: ${roleText}\n` +
				`│🌸 Cooldown: ${configCommand.countDown || 1}s\n` +
				`│🌸 Author: ${author}\n` +
				`├───「 USAGE 」───⭔\n` +
				`│ ${guideBody.split("\n").join("\n│ ")}\n` +
				`╰─────────────⭓`;

			return message.reply(guideMsg);
		}
	}
};

function checkLangObject(data, langCode) {
	if (typeof data == "string")
		return data;
	if (typeof data == "object" && !Array.isArray(data))
		return data[langCode] || data.en || undefined;
	return undefined;
}

function cropContent(content, max) {
	if (content.length > max) {
		content = content.slice(0, max - 3);
		content = content + "...";
	}
	return content;
}
