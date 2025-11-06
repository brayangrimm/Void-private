module.exports = {
    config: {
        name: "prefix",
        version: "3.0",
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
            const { getPrefix } = global.utils;
            const prefix = getPrefix(event.threadID);

            const emojis = [
                "💖", "💞", "✨", "🌸", "💫", "🩷", "💐", "🎀", "💕", "😚",
                "😊", "🥰", "😇", "🤭", "🙈", "💋", "🦋", "💎", "🌷", "😝",
                "🤍", "🌼", "🌹", "🍓", "🍒", "🩰", "🌺", "💗"
            ];

            const responses = [
                // Les 10 originales
                ".  /)    /)───────♡\n  (｡•ᴗ•｡)❥ 𝒯𝒶𝒾𝓁𝓈 𝒷𝑜𝓉 🩷\n╭∪─∪───────♡\n╰[%] Hihi~ tu veux connaître mon préfixe ? C’est 「%」 💋",
                ".  /)    /)───────♡\n  (｡>ω<｡) ❥𝒯𝒶𝒾𝓁𝓈𝒷𝑜𝓉\n╭∪─∪───────♡\n╰[%] Ouh~ tu es curieux⋆°｡♡ Oui c’est bien 「%」 ! 🌸",
                ".  /)    /)───────♡\n  (˶˃ᴗ˂˶) ❥𝒯𝒶𝒾𝓁𝓈𝒷𝑜𝓉\n╭∪─∪───────♡\n╰[%] Hihi~ le secret c’est 「%」 💞 garde-le pour toi hein 🫣",
                ".  /)    /)───────♡\n  (｡•ㅅ•｡) ❥𝒯𝒶𝒾𝓁𝓈 𝒷𝑜𝓉\n╭∪─∪───────♡\n╰[%] T’as deviné ? Ouiii 💫 c’est 「%」 !",
                ".  /)    /)───────♡\n  (⁄ ⁄>⁄ ▽ ⁄<⁄ ⁄) ❥𝒯𝒶𝒾𝓁𝓈𝒷𝑜𝓉\n╭∪─∪───────♡\n╰[%] Huhu~ j’te le dis juste à toi... c’est 「%」 🥺💗",
                ".  /)    /)───────♡\n  (•ᴗ•❁) ❥𝒯𝒶𝒾𝓁𝓈 𝒷𝑜𝓉\n╭∪─∪───────♡\n╰[%] Tu veux mon secret ? Okay 🩷 c’est 「%」 💖",
                ".  /)    /)───────♡\n  (｡•ᴗ-)ﾉﾞ❥𝒯𝒶𝒾𝓁𝓈𝒷𝑜𝓉\n╭∪─∪───────♡\n╰[%] Oups~ j’allais oublier de te le dire 🥰 c’est 「%」 ✨",
                ".  /)    /)───────♡\n  (✿>‿<) ❥𝒯𝒶𝒾𝓁𝓈𝒷𝑜𝓉\n╭∪─∪───────♡\n╰[%] Et voilàà 💕 「%」 c’est mon petit préfixe d’amour 💞",
                ".  /)    /)───────♡\n  (´｡• ω •｡`) ❥𝒯𝒶𝒾𝓁𝓈𝒷𝑜𝓉\n╭∪─∪───────♡\n╰[%] Hihi~ t’es trop mignon·ne 😚 mon préfixe c’est 「%」 💐",
                ".  /)    /)───────♡\n  (｡♥‿♥｡) ❥𝒯𝒶𝒾𝓁𝓈𝒷𝑜𝓉\n╭∪─∪───────♡\n╰[%] Allez~ juste pour toi 💕 c’est 「%」 🌷",

                // 🌸 50 nouvelles réponses kawaii et taquines 🌸
                "(*˘︶˘*).｡*♡ Coucou toi~ 「%」 c’est mon petit mot magique 💞",
                "(⁄ ⁄•⁄ω⁄•⁄ ⁄) hihi~ tu veux savoir ? c’est 「%」 💋",
                "UwU~ trop curieux·se 😚 mon préfixe c’est 「%」 💫",
                "Hehe~ tu veux jouer avec moi ? tape 「%」 💕",
                "T’as dit ‘prefix’ ? Ohhh tu veux savoir 🩷 「%」 🌸",
                "Mmh~ t’as une bonne mémoire 😏 c’est 「%」 💖",
                "(*≧ω≦) Hihi~ c’est tout simple : 「%」 🌺",
                "Et si je te le chuchotais à l’oreille ? 「%」 💋",
                "Haha~ devine ? Non, pas ça 😝 c’est 「%」 ✨",
                "Tu veux mon secret ? Je te le souffle doucement~ 「%」 💞",
                "Ohh~ t’es trop adorable 💗 c’est 「%」 🌼",
                "Hehe~ bravo d’avoir demandé 🩷 「%」 c’est le bon 💫",
                "Je suis flattée que tu me demandes 💐 c’est 「%」 😚",
                "Awww~ tu m’écoutes toujours hein 💕 「%」 💖",
                "T’as trouvé le bon mot magique 🌸 「%」 💋",
                "Kyaaa~ tu m’as appelée ? Mon préfixe c’est 「%」 🩷",
                "Hehe~ t’es si mignon quand tu demandes 🥰 「%」 ✨",
                "Ouh~ c’est que t’as de la mémoire toi 💞 「%」 🌷",
                "Tu veux un bisou avec le préfixe ? 💋 「%」 😝",
                "Hehe~ chuuut 🤭 「%」 c’est entre nous 💐",
                "Aww~ j’adore quand tu me parles comme ça 💗 「%」 🌺",
                "Kawaii comme toi mérite de savoir 💕 「%」 💖",
                "Hihi~ tu m’as fait rougir 😳 「%」 ✨",
                "Yaa~ encore toi 🥰 「%」 c’est toujours moi 💞",
                "Trop curieux·se 😚 allez~ 「%」 💫",
                "Huhu~ je savais que t’allais demander 💐 「%」 🌸",
                "UwU~ petit·e curieux·se 💕 「%」 💖",
                "Oww~ j’aime quand tu dis ‘prefix’ 💋 「%」 💗",
                "Hehe~ encore un·e fan 🩷 「%」 🌺",
                "Trop chouuuu 🌷 「%」 💞",
                "💞 Boo~ tu m’as trouvée ! 「%」 💋",
                "Hehe~ t’es rapide toi 😚 「%」 ✨",
                "Ouh~ j’adore ta curiosité 🌸 「%」 💐",
                "Mhm~ tu veux que je te le dise encore ? 「%」 💖",
                "Hihi~ tu me rends toute joyeuse 🩷 「%」 💫",
                "Et voilàà~ 「%」 🌺 juste pour toi 💕",
                "Ohh~ t’as dit le mot magique 💗 「%」 😚",
                "Hehe~ t’es si doux/douce 🥰 「%」 💖",
                "Kya~ j’adore quand tu me parles 💋 「%」 🌸",
                "(*≧▽≦)っ 「%」 c’est mon secret mignon 💞",
                "Awww~ ça me fait plaisir 💐 「%」 ✨",
                "Tu veux encore un indice ? C’est 「%」 💫",
                "Hehe~ bravo champion·ne 🌷 「%」 💕",
                "Kyaaa~ hihi c’est 「%」 🩷",
                "Aww~ t’as deviné 🥰 「%」 💖",
                "Hehe~ trop tard, je te l’ai dit 😝 「%」 🌸",
                "Huhu~ t’es adorable 💋 「%」 💞",
                "Ouh~ tu me fais fondre 💗 「%」 💐",
                "Hehe~ promis c’est le dernier secret 🌷 「%」 ✨",
                "Hihi~ garde-le bien en tête hein 🥰 「%」 💫",
                "UwU~ tu veux un rappel ? C’est 「%」 💕"
            ];

            const randomEmoji = emojis[Math.floor(Math.random() * emojis.length)];
            const randomResponse = responses[Math.floor(Math.random() * responses.length)]
                .replace(/\[%\]/g, randomEmoji)
                .replace(/%/g, prefix);

            return message.reply(randomResponse);
        }
    }
};
