import { Game } from "./Game";

describe("Game1", () => {
  it("Game1 results", () => {
    document.body.innerHTML =
      '<div id="controls">' +
      '  <label class="X"' +
      "    >Строки:" +
      '    <input id="x-ax" type="number" />' +
      "  </label>" +
      '  <label class="Y"' +
      "    >Колонки:" +
      '    <input id="y-ax" type="number" />' +
      "  </label>" +
      '  <label class="speed"' +
      "    >Скорость игры:" +
      '    <select id="speed"></select>' +
      '    <button id="start"><span>Старт</span></button>' +
      '    <button id="clear"><span>Обновить</span></button>' +
      '    <button id="random"><span>Создать жизнь</span></button>' +
      "  </label>" +
      "</div>" +
      '<div id="gridContainer"></div>' +
      "<body></body>";
    const myGame = new Game();
    myGame.initialize();
    // console.log(myGame.grid);
    const grid = myGame.grid.flat(Infinity).length;
    const nextGrid = myGame.nextGrid.flat(Infinity).length;
    // const table = myGame.table.innerHTML;
    const xValue = myGame.xValue;
    const yValue = myGame.yValue;

    console.log(xValue);
    expect(myGame).toBeInstanceOf(Game);
    expect(typeof myGame).toBe("object");
    expect(grid).toEqual(2500);
    expect(nextGrid).toEqual(2500);
    expect(xValue.value).toEqual("50");
    expect(yValue.value).toEqual("50");
  });
});

describe("Game2", () => {
  it("Game2 results", () => {
    document.body.innerHTML =
      '<div id="controls">' +
      '  <label class="X"' +
      "    >Строки:" +
      '    <input id="x-ax" type="number" />' +
      "  </label>" +
      '  <label class="Y"' +
      "    >Колонки:" +
      '    <input id="y-ax" type="number" />' +
      "  </label>" +
      '  <label class="speed"' +
      "    >Скорость игры:" +
      '    <select id="speed"></select>' +
      '    <button id="start"><span>Старт</span></button>' +
      '    <button id="clear"><span>Обновить</span></button>' +
      '    <button id="random"><span>Создать жизнь</span></button>' +
      "  </label>" +
      "</div>" +
      '<div id="gridContainer"></div>' +
      "<body></body>";
    const myGame = new Game();
    myGame.initialize();
    // console.log(myGame.grid);

    // const table = myGame.table.innerHTML;
    const xValue = myGame.xValue;
    const yValue = myGame.yValue;

    xValue.value = 10;
    yValue.value = 10;
    myGame.clearButtonHandler();
    const grid = myGame.grid.flat(Infinity).length;
    const nextGrid = myGame.nextGrid.flat(Infinity).length;
    myGame.randomButtonHandler();
    const random = myGame.grid.flat(Infinity).filter((val) => val > 0).length;
    myGame.startButtonHandler(myGame.startButton);
    const gridAfterStart = myGame.grid
      .flat(Infinity)
      .filter((val) => val > 0).length;

    const speedSelect = myGame.speedSelect;

    console.log(speedSelect.options[1].innerText);
    const speedOption = document.createElement("option");
    speedOption.text = "x2";
    myGame.speedHandler(speedOption);
    myGame.startButtonHandler(myGame.startButton);

    expect(grid).toEqual(100);
    expect(nextGrid).toEqual(100);
    expect(random).toBeGreaterThan(0);
    expect(gridAfterStart - random).not.toBe(0);
    expect(myGame.reproductionTime).toEqual(500);
    expect(myGame.gameCondtition).toBeTruthy();
    expect(myGame.playing).toBeFalsy();
  });
});

describe("Game3", () => {
  it("Game3 results", () => {
    document.body.innerHTML =
      '<div id="controls">' +
      '  <label class="X"' +
      "    >Строки:" +
      '    <input id="x-ax" type="number" />' +
      "  </label>" +
      '  <label class="Y"' +
      "    >Колонки:" +
      '    <input id="y-ax" type="number" />' +
      "  </label>" +
      '  <label class="speed"' +
      "    >Скорость игры:" +
      '    <select id="speed"></select>' +
      '    <button id="start"><span>Старт</span></button>' +
      '    <button id="clear"><span>Обновить</span></button>' +
      '    <button id="random"><span>Создать жизнь</span></button>' +
      "  </label>" +
      "</div>" +
      '<div id="gridContainer"></div>' +
      "<body></body>";
    const myGame = new Game();
    myGame.initialize();

    const xValue = myGame.xValue;
    const yValue = myGame.yValue;

    xValue.value = 2;
    yValue.value = 2;
    myGame.clearButtonHandler();

    const random = myGame.grid.flat(Infinity).filter((val) => val > 0).length;

    const cell = document.createElement("td");
    cell.setAttribute("id", "1_1");
    cell.setAttribute("class", "dead");
    console.log(myGame.grid);
    myGame.cellClickHandler(cell);
    console.log(myGame.grid);
    const random1 = myGame.grid.flat(Infinity).filter((val) => val > 0).length;
    myGame.startButtonHandler(myGame.startButton);
    expect(random).toBe(0);
    expect(random1).toBeGreaterThan(0);
    expect(myGame.playing).toBeTruthy();
  });
});
