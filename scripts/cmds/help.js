const fs = require("fs");

module.exports = {
  config: {
    name: "help",
    aliases: ["menu", "cmds"],
    version: "6.0",
    author: "Voldigo Anos",
    countDown: 5,
    role: 0,
    shortDescription: "Menu d’aide adorable et coloré 💖",
    longDescription: "Affiche le menu d’aide avec un style doux, féminin et décoré 🌸",
    category: "system",
    guide: {
      en: "{pn} [page | nomCommande]"
    }
  },

  onStart: async function ({ api, event, args, prefix, threadsData }) {
    const commands = global.GoatBot?.commands || new Map();

    // Préfixe dynamique 🌈
    const threadData = await threadsData.get(event.threadID);
    const threadPrefix = threadData?.data?.prefix || prefix || global.GoatBot.config.prefix || "^";

    // 💖 help <commande>
    if (args[0] && isNaN(args[0])) {
      const name = args[0].toLowerCase();
      const cmd =
        commands.get(name) ||
        Array.from(commands.values()).find(c => c.config.aliases?.includes(name));

      if (!cmd)
        return api.sendMessage(`❌ Oups ! La commande "${name}" n’existe pas 💔`, event.threadID, event.messageID);

      const { config } = cmd;
      const aliases = config.aliases?.length ? config.aliases.join(", ") : "Aucun 💭";
      const role =
        config.role == 2 ? "👑 Admin" : config.role == 1 ? "⚙️ Modératrice" : "🌷 Utilisatrice";
      const cooldown = config.countDown ? `${config.countDown} sec` : "Aucun ⏳";
      const category = config.category || "Autre 🌸";

      const msg =
`╔═══════♡ 💕 𝐈𝐍𝐅𝐎 𝐂𝐎𝐌𝐌𝐀𝐍𝐃𝐄 💕 ♡═══════╗
║ 🌸 Nom : ${config.name}
║ 💐 Catégorie : ${category}
║ 💖 Description :
║   ${config.longDescription || config.shortDescription || "Aucune description disponible 🌺"}
║ 🎀 Alias : ${aliases}
║ ⏰ Cooldown : ${cooldown}
║ 👑 Rôle : ${role}
║
║ 🌈 Utilisation :
║   ${threadPrefix}${config.guide?.en || config.name}
╚════════════════════════════════════╝`;

      return api.sendMessage(msg, event.threadID, event.messageID);
    }

    // 💕 Menu principal
    const page = parseInt(args[0]) || 1;

    // Trier les commandes par catégorie
    const categorized = {};
    for (const [name, cmd] of commands.entries()) {
      const cat = cmd.config?.category || "Autre 🌷";
      if (!categorized[cat]) categorized[cat] = [];
      categorized[cat].push(cmd.config.name);
    }

    const allCategories = Object.entries(categorized);
    const totalPages = Math.ceil(allCategories.length / 3);
    if (page < 1 || page > totalPages)
      return api.sendMessage(`❌ Page invalide 🌸 Il y a ${totalPages} pages !`, event.threadID, event.messageID);

    const startIndex = (page - 1) * 3;
    const endIndex = startIndex + 3;
    const pageCategories = allCategories.slice(startIndex, endIndex);

    // 🌺 Message kawaii
    let msg = "";
    msg += "╔════════════════════════════════════╗\n";
    msg += "║      🌷💞 𝐌𝐄𝐍𝐔 𝐃’𝐀𝐈𝐃𝐄 𝐑𝐎𝐒𝐄 💞🌷       ║\n";
    msg += "╠════════════════════════════════════╣\n";

    pageCategories.forEach(([cat, cmds]) => {
      msg += `║ 💌 ${cat.toUpperCase()}\n`;
      msg += "║ ────────────────────────────────\n";
      cmds.sort().forEach(cmd => {
        msg += `║ 💖 ${cmd}\n`;
      });
      msg += "║ ────────────────────────────────\n";
    });

    msg += `║ 📄 Page : ${page} / ${totalPages}\n`;
    msg += `║ 💫 Commandes : ${commands.size}\n`;
    msg += `║ 💋 Utilise : ${threadPrefix}help <commande>\n`;
    msg += "╚════════════════════════════════════╝";

    api.sendMessage(msg, event.threadID, event.messageID);
  }
};
