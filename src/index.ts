import "../css/style.css";
import { Game } from "./Game";

const myGame = new Game();
console.log(myGame);
window.onload = () => {
  myGame.initialize();
};
