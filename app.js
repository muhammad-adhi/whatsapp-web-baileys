const { default: makeWASocket, makeInMemoryStore, MessageType, MessageOptions, Mimetype, DisconnectReason, useSingleFileAuthState, isHistoryMsg, isJidGroup } = require("@adiwajshing/baileys");
const { Boom } = require("@hapi/boom");
const { state, saveState } = useSingleFileAuthState("./auth_info.json");
const { buttonMessage, listPesan, sections } = require("./function/button");

async function connectToWhatsApp() {
   const sock = makeWASocket({
      auth: state,
      printQRInTerminal: true,
   });
   sock.ev.on("connection.update", (update) => {
      //console.log(update);
      const { connection, lastDisconnect } = update;
      if (connection === "close") {
         const shouldReconnect = (lastDisconnect.error = Boom)?.output?.statusCode !== DisconnectReason.loggedOut;
         console.log("connection closed due to ", lastDisconnect.error, ", reconnecting ", shouldReconnect);
         // reconnect if not logged out
         if (shouldReconnect) {
            connectToWhatsApp();
         }
      } else if (connection === "open") {
         console.log("\n\n\n");
      }
   });
   sock.ev.on("creds.update", saveState);
   sock.ev.on("messages.upsert", async ({ messages, type }) => {
      if (type === "notify") {
         if (!messages[0].key.fromMe) {
            //tentukan jenis pesan berbentuk text
            const pesan = messages[0].message.conversation.toLowerCase();

            //tentukan jenis pesan apakah bentuk list
            const responseList = messages[0].message.listResponseMessage;

            //tentukan jenis pesan apakah bentuk button
            const responseButton = messages[0].message.buttonsResponseMessage;

            //tentukan jenis pesan apakah bentuk templateButtonReplyMessage
            // const responseReplyButton = messages[0].message.templateButtonReplyMessage;

            //nowa dari pengirim pesan sebagai id
            const noWa = messages[0].key.remoteJid;

            await sock.readMessages([messages[0].key]);
            const isGroup = noWa.endsWith("@g.us");

            //kecilkan semua pesan yang masuk lowercase
            for (var m of messages) {
               console.log("A message from", m.pushName, `["${pesan}" ${noWa}]`);
            }

            // console.log(`NEW ["${pesan}" ${noWa}]`);
            if (!isGroup) {
               if (pesan === "ping") {
                  await sock.sendMessage(noWa, { text: "Pong" }, { quoted: messages[0] });
               } else if (!messages[0].key.fromMe && pesan === ".menu") {
                  await sock.sendMessage(noWa, {
                     text: `*Halo ${m.pushName}*\n\nSelamat Datang di Bot whatsapp kami\nsilahkan tekan menu untuk menggunakan feature bot\n\n`,
                     footer: "©Aldhi2022",
                     buttonText: "Menu",
                     sections,
                  });
               } else if (!messages[0].key.fromMe && responseList) {
                  //cek row id yang dipilih
                  const pilihanlist = responseList.singleSelectReply.selectedRowId;
                  if (pilihanlist == "nanya") {
                     await sock.sendMessage(noWa, { text: "Anda Memilih function nanya" });
                  } else if (pilihanlist == "bg") {
                     await sock.sendMessage(noWa, { text: "Anda Memilih function ubah background" });
                  } else if (pilihanlist == "menfes") {
                     await sock.sendMessage(noWa, { text: "Anda Memilih function menfes" });
                  } else if (pilihanlist == "stiker") {
                     await sock.sendMessage(noWa, { text: "Anda Memilih function stiker" });
                  }
               } else {
                  await sock.sendMessage(noWa, { text: `*Halo ${m.pushName}*\n\njika ingin menggunakan bot ini silahkan kirim *.menu*` }, { quoted: messages[0] });
               }
            }
         }
      }
   });
}

connectToWhatsApp().catch((err) => console.log("unexpected error: " + err)); // catch any errors
