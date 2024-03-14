import dotenv from "dotenv";
import { createBot } from "mineflayer";
dotenv.config();

const init = () => {
  try {
    const bot = createBot({
      host: process.env.host,
      port: process.env.port,
      username: process.env.username,
      auth: "offline", // Change here to "microsoft" when authentication needed
    });
    console.log("Connecting...");

    const changeView = async () => {
      const yaw = Math.random() * Math.PI - 0.5 * Math.PI,
        pitch = Math.random() * Math.PI - 0.5 * Math.PI;

      await bot.look(yaw, pitch, false);
      return;
    };

    bot.on("login", () => {
      // bot.chat("こんにちは");
      setInterval(async () => {
        await changeView();
      }, 1000 * 3);
    });

    bot.on("end", (reason) => {
      console.error(reason);
      console.log("Reconnecting...");
      setTimeout(() => {
        init();
      }, 1000 * 30);
    });

    // bot.on("error", (err) => {
    //   console.log(err);
    //   console.log("Reconnecting...");
    //   setTimeout(() => {
    //     init();
    //   }, 1000 * 10);
    // });
  } catch (error) {
    init();
  }
};

init();
