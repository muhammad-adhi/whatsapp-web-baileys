const buttons = [
   { buttonId: "id1", buttonText: { displayText: "Info 1!" }, type: 1 },
   { buttonId: "id2", buttonText: { displayText: "Info 2!" }, type: 1 },
   { buttonId: "id3", buttonText: { displayText: "Info 3" }, type: 1 },
];

const buttonMessage = {
   text: "select feature",
   footer: "©Aldhi2022",
   headerType: 1,
   buttons,
};

const sections = [
   {
      title: "List Feature Bot",
      rows: [
         { title: "Nanya AI", rowId: "nanya" },
         { title: "Ubah Background", rowId: "bg" },
         { title: "Menfes", rowId: "menfes" },
         { title: "Stiker", rowId: "stiker" },
      ],
   },
];

const listPesan = {
   text: "Selamat Datang di Bot whatsapp kami\nsilakan tekan menu untuk menggunakan feature bot\n\n\n",
   footer: "©Aldhi2022",
   buttonText: "Menu",
   sections,
};

module.exports = { buttonMessage, listPesan, sections };
