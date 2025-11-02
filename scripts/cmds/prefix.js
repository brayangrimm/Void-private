module.exports = {
    config: {
        name: "prefix",
        version: "2.1",
        author: "XxGhostxx & BrayanPrince",
        countDown: 5,
        role: 0,
        shortDescription: "Affiche le préfixe du bot",
        longDescription: "Répond avec un ton mignon et taquin pour montrer le préfixe du bot",
        category: "reply"
    },

    onStart: async function () {},

    onChat: async function ({ event, message, getLang, threadsData }) {
        if (event.body && event.body.toLowerCase() === "prefix") {
            // 💫 Récupération du préfixe du salon
            const { getPrefix } = global.utils;
            const prefix = getPrefix(event.threadID);

            // 🌸 Liste d'emojis mignons et féminins
            const emojis = [
                "💖", "💞", "✨", "🌸", "💫", "🩷", "💐", "🎀", "💕", "😚",
                "😊", "🥰", "😇", "🤭", "🙈", "💋", "🦋", "💎", "🌷", "😝",
                "🤍", "🌼", "🌹", "🍓", "🍒", "🩰", "🌺", "💗"
            ];

            // 💕 Réponses mignonnes avec le vrai préfixe inclus
            const responses = [
                ".  /)    /)───────♡\n  (｡•ᴗ•｡)❥ 𝒯𝒶𝒾𝓁𝓈 𝒷𝑜𝓉 🩷\n╭∪─∪───────♡\n╰[%] Hihi~ tu veux connaître mon préfixe ? C’est 「%」 💋",
                ".  /)    /)───────♡\n  (｡>ω<｡) ❥𝒯𝒶𝒾𝓁𝓈𝒷𝑜𝓉\n╭∪─∪───────♡\n╰[%] Ouh~ tu es curieux⋆°｡♡ Oui c’est bien 「%」 ! 🌸",
                ".  /)    /)───────♡\n  (˶˃ᴗ˂˶) ❥𝒯𝒶𝒾𝓁𝓈𝒷𝑜𝓉\n╭∪─∪───────♡\n╰[%] Hihi~ le secret c’est 「%」 💞 garde-le pour toi hein 🫣",
                ".  /)    /)───────♡\n  (｡•ㅅ•｡) ❥𝒯𝒶𝒾𝓁𝓈 𝒷𝑜𝓉\n╭∪─∪───────♡\n╰[%] T’as deviné ? Ouiii 💫 c’est 「%」 !",
                ".  /)    /)───────♡\n  (⁄ ⁄>⁄ ▽ ⁄<⁄ ⁄) ❥𝒯𝒶𝒾𝓁𝓈𝒷𝑜𝓉\n╭∪─∪───────♡\n╰[%] Huhu~ j’te le dis juste à toi... c’est 「%」 🥺💗",
                ".  /)    /)───────♡\n  (•ᴗ•❁) ❥𝒯𝒶𝒾𝓁𝓈 𝒷𝑜𝓉\n╭∪─∪───────♡\n╰[%] Tu veux mon secret ? Okay 🩷 c’est 「%」 💖",
                ".  /)    /)───────♡\n  (｡•ᴗ-)ﾉﾞ❥𝒯𝒶𝒾𝓁𝓈𝒷𝑜𝓉\n╭∪─∪───────♡\n╰[%] Oups~ j’allais oublier de te le dire 🥰 c’est 「%」 ✨",
                ".  /)    /)───────♡\n  (✿>‿<) ❥𝒯𝒶𝒾𝓁𝓈𝒷𝑜𝓉\n╭∪─∪───────♡\n╰[%] Et voilàà 💕 「%」 c’est mon petit préfixe d’amour 💞",
                ".  /)    /)───────♡\n  (´｡• ω •｡`) ❥𝒯𝒶𝒾𝓁𝓈𝒷𝑜𝓉\n╭∪─∪───────♡\n╰[%] Hihi~ t’es trop mignon·ne 😚 mon préfixe c’est 「%」 💐",
                ".  /)    /)───────♡\n  (｡♥‿♥｡) ❥𝒯𝒶𝒾𝓁𝓈𝒷𝑜𝓉\n╭∪─∪───────♡\n╰[%] Allez~ juste pour toi 💕 c’est 「%」 🌷"
            ];

            // 🌷 Choix aléatoire d’un emoji et d’une phrase
            const randomEmoji = emojis[Math.floor(Math.random() * emojis.length)];
            const randomResponse = responses[Math.floor(Math.random() * responses.length)]
                .replace(/\[%\]/g, randomEmoji)
                .replace(/%/g, prefix);

            // 💌 Envoi du message mignon avec le vrai préfixe
            return message.reply(randomResponse);
        }
    }
};
