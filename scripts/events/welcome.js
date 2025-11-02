const { getTime } = global.utils;
if (!global.temp.welcomeEvent)
  global.temp.welcomeEvent = {};

module.exports = {
  config: {
    name: "welcome",
    version: "2.2",
    author: "BrayanPrince & NTKhang (féminisé 🌸)",
    category: "events"
  },

  langs: {
    en: {
      session1: "☀️ matin",
      session2: "🌤️ midi",
      session3: "🌆 après-midi",
      session4: "🌙 soirée",
      welcomeMessage:
        "╭───────💖───────╮\n" +
        "Coucou~ merci de m’avoir invitée 💕\n" +
        "dans votre joli groupe 🌸\n" +
        "Je ferai de mon mieux pour vous aider ✨\n" +
        "Mon préfixe est 【%1】\n" +
        "Pour voir mes commandes, tapez : %1help 💅\n" +
        "╰───────💖───────╯",
      multiple1: "toi",
      multiple2: "vous",
      defaultWelcomeMessage:
        "💞 Coucou {userName} 💞\n" +
        "Bienvenue dans {boxName} ! 🌷\n" +
        "J’espère que tu passeras une superbe {session} parmi nous 🥰"
    }
  },

  onStart: async ({ threadsData, message, event, api, getLang }) => {
    if (event.logMessageType == "log:subscribe")
      return async function () {
        const hours = getTime("HH");
        const { threadID } = event;
        const { nickNameBot } = global.GoatBot.config;
        const prefix = global.utils.getPrefix(threadID);
        const dataAddedParticipants = event.logMessageData.addedParticipants;

        // 🌸 Si le bot rejoint le groupe
        if (dataAddedParticipants.some((item) => item.userFbId == api.getCurrentUserID())) {
          if (nickNameBot)
            api.changeNickname(nickNameBot, threadID, api.getCurrentUserID());

          const confirmationImage = "https://i.imgur.com/m9Cgn1q.jpeg"; // image principale du bot
          const confirmationMessage = getLang("welcomeMessage", prefix);

          await message.send({
            body: confirmationMessage,
            attachment: await global.utils.getStreamFromURL(confirmationImage)
          });
        }

        // 🌷 Si un membre rejoint
        if (!global.temp.welcomeEvent[threadID])
          global.temp.welcomeEvent[threadID] = {
            joinTimeout: null,
            dataAddedParticipants: []
          };

        global.temp.welcomeEvent[threadID].dataAddedParticipants.push(...dataAddedParticipants);
        clearTimeout(global.temp.welcomeEvent[threadID].joinTimeout);

        global.temp.welcomeEvent[threadID].joinTimeout = setTimeout(async function () {
          const threadData = await threadsData.get(threadID);
          if (threadData.settings.sendWelcomeMessage == false)
            return;

          const dataAddedParticipants = global.temp.welcomeEvent[threadID].dataAddedParticipants;
          const dataBanned = threadData.data.banned_ban || [];
          const threadName = threadData.threadName;
          const userName = [], mentions = [];
          let multiple = false;

          if (dataAddedParticipants.length > 1)
            multiple = true;

          for (const user of dataAddedParticipants) {
            if (dataBanned.some((item) => item.id == user.userFbId))
              continue;
            userName.push(user.fullName);
            mentions.push({
              tag: user.fullName,
              id: user.userFbId
            });
          }

          if (userName.length == 0) return;

          let { welcomeMessage = getLang("defaultWelcomeMessage") } = threadData.data;

          const form = {
            mentions: welcomeMessage.match(/\{userNameTag\}/g) ? mentions : null
          };

          welcomeMessage = welcomeMessage
            .replace(/\{userName\}|\{userNameTag\}/g, userName.join(", "))
            .replace(/\{boxName\}|\{threadName\}/g, threadName)
            .replace(
              /\{multiple\}/g,
              multiple ? getLang("multiple2") : getLang("multiple1")
            )
            .replace(
              /\{session\}/g,
              hours <= 10
                ? getLang("session1")
                : hours <= 12
                  ? getLang("session2")
                  : hours <= 18
                    ? getLang("session3")
                    : getLang("session4")
            );

          form.body = welcomeMessage;

          // 🌺 15 IMAGES D’ANIME MIGNONNES
          const cuteAnimeImages = [
            "https://i.imgur.com/m9Cgn1q.jpeg",
            "https://i.imgur.com/hA4iqJY.jpeg",
            "https://i.imgur.com/tQ7zS6T.jpeg",
            "https://i.imgur.com/YrIapZf.jpeg",
            "https://i.imgur.com/gEvOXbn.jpeg",
            "https://i.imgur.com/6rOdI7k.jpeg",
            "https://i.imgur.com/G4d52Db.jpeg",
            "https://i.imgur.com/QbPCXWW.jpeg",
            "https://i.imgur.com/j7mBy38.jpeg",
            "https://i.imgur.com/AE5hcBe.jpeg",
            "https://i.imgur.com/VN4TsvN.jpeg",
            "https://i.imgur.com/0RmK4Vg.jpeg",
            "https://i.imgur.com/dZgAIco.jpeg",
            "https://i.imgur.com/df4i7X9.jpeg",
            "https://i.imgur.com/Xy1fWbC.jpeg"
          ];

          // 🌸 Choix aléatoire d'une image
          const randomImage = cuteAnimeImages[Math.floor(Math.random() * cuteAnimeImages.length)];

          // 🌼 Envoi du message avec image mignonne
          await message.send({
            body: welcomeMessage,
            attachment: await global.utils.getStreamFromURL(randomImage)
          });
        }, 1500);
      };
  }
};
