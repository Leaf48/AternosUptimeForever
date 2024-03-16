import dotenv from "dotenv";
import { createBot } from "mineflayer";
dotenv.config();

const commands = ["forward", "back", "left", "right", "jump"];

const getRandom = (arr) => arr[Math.floor(Math.random() * arr.length)];

const sleep = (wait) => new Promise((resolve) => setTimeout(resolve, wait));

let loop;

const reconnect = () => {
  clearInterval(loop);
  setTimeout(() => {
    init();
  }, 1000 * 30);
};

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

    const changePos = async () => {
      const action = getRandom(commands);
      bot.setControlState("sprint", true);
      bot.setControlState(action, true);
      await sleep(5000); // 5秒待機
      bot.clearControlStates();
    };

    bot.once("login", () => {
      console.log("Logged in successfully");
      // bot.chat("こんにちは");
    });

    bot.on("spawn", () => {
      loop = setInterval(() => {
        changeView();
        changePos();
      }, 1000 * 10);
    });

    bot.once("end", (reason) => {
      console.error(reason);
      console.log("Reconnecting...");
      reconnect();
    });

    bot.once("error", (err) => {
      console.log(err);
      console.log("Reconnecting...");
      reconnect();
    });
  } catch (error) {
    init();
  }
};

init();
