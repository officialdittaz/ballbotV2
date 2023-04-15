import fs from "fs";
import simi from "similarity";
let sensitive = 0.75,
database = {
	
}
const handle = {
  say: ["tebaktebakan"],
  category: "#game",
  describe: "game tebak tebakan random",
  master: async (m, { conn, q, d, bb, repl }) => {
    let i = m.chat;
    if (i in conn.kimia) return repl("Masih ada game di sini!!!\nMohon tunggu selesai...");
    let res = JSON.parse(fs.readFileSync(process.cwd() + "/utils/db/tebaktebakan.json")).rendem();
    let soal = res.soal;
    let jawaban = res.jawaban;
    console.log("Soal: " + soal + "\n" + "Jawaban: " + jawaban);
    let teks = `*Game Tebak tebakan*\n\nCoba tebak soal ini *${soal}* \nWaktu: ${q.timeoutgame / 1000} detik\n`;
    let teks2 = `Waktu berakhir :(\nSoal tebak tebakan: ${soal}\n\n Jawaban nya : ${bb(jawaban)}`;
    database[i] = [
      await repl(teks),
      soal,
      jawaban.toLowerCase(),
      setTimeout(function () {
        if (database[i]) repl(teks2);
        delete database[i];
      }, q.timeoutgame)
    ];
  },
  main: async (m, { q, conn, bb, budy, repl }) => {
    let i = m.chat;
    if (i in database) {
      if (simi(database[i][2], budy.toLowerCase()) >= sensitive) {
        repl(`Jawaban benarr!!!\n\nSoalan:\n${bb(database[i][1])}\nJawaban : ${database[i][2]}`);
        clearTimeout(database[i][3]);
        delete database[i];
      }
    }
  }
};

export default handle;