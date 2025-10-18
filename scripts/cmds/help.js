const fs = require("fs-extra");
const axios = require("axios");
const path = require("path");
const { getPrefix } = global.utils;
const { commands, aliases } = global.GoatBot;
const doNotDelete = "[ 𝑀𝐸𝑆𝑆𝐼𝐸 𝕆𝐒𝐴𝑁𝐺𝑂 ]";

module.exports = {
  config: {
    name: "help",
    version: "1.17",
    author: "ʚʆɞ Gūɱbāllʚʆɞ ",
    countDown: 10,
    role: 0,
    shortDescription: {
      en: "View command usage and list all commands directly",
    },
    longDescription: {
      en: "View command usage and list all commands directly",
    },
    category: "info",
    guide: {
      en: "{pn} / help cmdName ",
    },
    priority: 1,
  },

  onStart: async function ({ message, args, event, threadsData, role }) {
    const { threadID } = event;
    const threadData = await threadsData.get(threadID);
    const prefix = getPrefix(threadID);
  
    if (args.length === 0) {
      const categories = {};
      let msg = "";

      msg += `╭───💛🦔 ❦𝗛𝗘𝗟𝗣 𝗟𝗜𝗦𝗧𝗘  🦔💛────╮\n│\n│   ✰ ✰\n│`;

      for (const [name, value] of commands) {
        if (value.config.role > 1 && role < value.config.role) continue;

        const category = value.config.category || "Uncategorized";
        categories[category] = categories[category] || { commands: [] };
        categories[category].commands.push(name);
      }

      Object.keys(categories).forEach((category) => {
        let emojiCategory = "🔑"; // Default emoji
        switch (category) {
          case "info":
            emojiCategory = "ℹ️";
            break;
          case "fun":
            emojiCategory = "🎉";
            break;
          case "utility":
            emojiCategory = "🛠️";
            break;
          // Ajoutez plus de catégories et d'emojis selon vos besoins
          default:
            emojiCategory = "📁";
            break;
        }

        msg += `\n│\n│ ╭───────✨───────\n│ │ ${emojiCategory} ${category.toUpperCase()} 🦔`;
        
        const names = categories[category].commands.sort();
        for (let i = 0; i < names.length; i += 3) {
          const cmds = names.slice(i, i + 3).map((item) => `• ${item}`);
          msg += `\n│ │ ${cmds.join(" ".repeat(Math.max(1, 5 - cmds.join("").length)))}`;
        }

        msg += `\n│ ╰─────────✨─────`;
      });

      msg += `\n│\n│ 𝗖𝗢𝗡𝗧𝗔𝗖𝗧𝗘 🦔   FACEBOOK:\n│\n│ https://www.facebook.com/share/1AC3xtoMyv/?mibextid=wwXIfr\n│\n╰───────────────╯\n│ ʚʆɞ Gūɱbāllʚʆɞ ✯`;
      msg += `\n🗑️❌  [ X ]  🗑️`; // Ajout de la croix

      await message.reply(msg);
    } else {
      const commandName = args[0].toLowerCase();
      const command = commands.get(commandName) || commands.get(aliases.get(commandName));

      if (!command) {
        await message.reply(`❌ Command "${commandName}" not found.`);
      } else {
        const configCommand = command.config;
        const roleText = roleTextToString(configCommand.role);
        const author = configCommand.author || "Unknown";

        const longDescription = configCommand.longDescription ? configCommand.longDescription.en || "No description" : "No description";
        const guideBody = configCommand.guide?.en || "No guide available.";
        const usage = guideBody.replace(/{p}/g, prefix).replace(/{n}/g, configCommand.name);

        const response = `╭───💛🦔HEDGEHOG 𝐵𝑜𝑡 🦔💛────╮
│
│ ╭─────────────    ──────── NAME
│ 🦔 │ ${configCommand.name} ❌
│ ├─────── INFO ────────────────
│ 🦔 │ ✨Description: ${longDescription}
│ │ Other names: ${configCommand.aliases ? configCommand.aliases.join(", ") : "Do not have"}
│ │ Other names in your group: Do not have
│ 🦔 │ Version: ${configCommand.version || "1.0"}
│ │ ⚙️ Role: ${roleText}
│ 🦔 │ ⏳ Time per command: ${configCommand.countDown || 1}s
│ 🦔 │ 👨🏼‍💻 Author: ${author}
│ ├─────── Usage ───────────────
│ 🦔 │ 👁️‍🗨️ ${usage}
│ ├─────── Notes ───────────────
│ 🦔 │ The content inside <XXXXX> can be changed.
│ 🦔 │ The content inside [a|b|c] is a or b or c.
│ ╰─────✨─────────────────────────🦔 
│
╰─────✨────────────────────────🩸──╯`;

        await message.reply(response);
      }
    }
  },
};

function roleTextToString(roleText) {
  switch (roleText) {
    case 0:
      return "0 (All users)";
    case 1:
      return "1 (Group administrators)";
    case 2:
      return "2 (Admin bot)";
    default:
      return "Unknown role";
  }
            }
