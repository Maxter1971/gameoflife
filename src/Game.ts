interface IGame {
  rows: number;
  cols: number;
  playing: boolean;
  grid: number[];
  nextGrid: number[];
  timer: number;
  reproductionTime: number;
  gameCondtition: boolean;
  gridContainer: HTMLElement;
  table: HTMLTableElement;
  startButton: HTMLElement;
  clearButton: HTMLElement;
  xValue: HTMLInputElement;
  yValue: HTMLInputElement;
  speedSelect: HTMLElement;
  initializeGrids: () => void;
  resetGrids: () => void;
  copyAndResetGrid: () => void;
  initialize: () => void;
  createTable(): boolean;
  cellClickHandler: (e: HTMLSelectElement) => void;
  updateView: (gridApp: number[][]) => void;
  setupControlButtons: () => void;
  randomButtonHandler: () => void;
  clearButtonHandler: () => void;
  speedHandler: (value: EventTarget) => void;
  startButtonHandler: (e: HTMLElement) => void;
  play: (grid: number[][]) => void;
  computeNextGen: () => void;
  applyRules: (col: number, row: number) => void;
  countNeighbors(col: number, row: number): number;
}

export class Game {
  rows = 50;

  cols = 50;

  playing = false;

  timer = 0;

  reproductionTime = 1000;

  grid = new Array(this.rows);

  nextGrid = new Array(this.rows);

  gameCondtition = false;

  gridContainer = Object.create(HTMLElement.prototype, {});

  startButton = Object.create(HTMLElement.prototype, {});

  clearButton = Object.create(HTMLElement.prototype, {});

  xValue = Object.create(HTMLElement.prototype, {});

  yValue = Object.create(HTMLElement.prototype, {});

  speedSelect = Object.create(HTMLElement.prototype, {});

  table = Object.create(HTMLTableElement.prototype, {});

  initializeGrids() {
    for (let i = 0; i < this.rows; i++) {
      this.grid[i] = new Array(this.cols);
      this.nextGrid[i] = new Array(this.cols);
    }
  }

  resetGrids() {
    for (let i = 0; i < this.rows; i++) {
      for (let j = 0; j < this.cols; j++) {
        this.grid[i][j] = 0;
        this.nextGrid[i][j] = 0;
      }
    }
  }

  copyAndResetGrid() {
    for (let i = 0; i < this.rows; i++) {
      for (let j = 0; j < this.cols; j++) {
        this.grid[i][j] = this.nextGrid[i][j];
        this.nextGrid[i][j] = 0;
      }
    }
  }

  initialize() {
    if (document.readyState === "complete") {
      this.createTable();
      this.initializeGrids();
      this.resetGrids();
      this.setupControlButtons();
    }
  }

  createTable() {
    let result = false;
    this.gridContainer = document.getElementById(
      "gridContainer"
    ) as HTMLElement;
    if (!this.gridContainer) {
      console.error("Нет контейнера для поля игры");
    }
    this.table = document.createElement("table") as HTMLTableElement;

    for (let i = 0; i < this.rows; i++) {
      const tr = document.createElement("tr");
      for (let j = 0; j < this.cols; j++) {
        const cell = document.createElement("td") as HTMLTableCellElement;
        let sc = "";
        sc = sc.concat(String(i), "_", String(j));
        cell.setAttribute("id", sc);
        cell.setAttribute("class", "dead");
        // cell.onclick = this.cellClickHandler();
        cell.addEventListener("click", (e) => {
          this.cellClickHandler(cell);
        });
        tr.appendChild(cell);
      }
      this.table.appendChild(tr);
    }
    this.gridContainer.appendChild(this.table);
    result = true;
    return result;
  }

  cellClickHandler(e: HTMLElement) {
    const rowcol = e.id.split("_");
    const row = Number(rowcol[0]);
    const col = Number(rowcol[1]);

    const classes = e.getAttribute("class") as string;
    if (classes.indexOf("live") > -1) {
      e.setAttribute("class", "dead");
      this.grid[row][col] = 0;
    } else {
      e.setAttribute("class", "live");
      this.grid[row][col] = 1;
    }
    this.gameCondtition = true;
  }

  updateView(gridApp: number[][]) {
    for (let i = 0; i < this.rows; i++) {
      for (let j = 0; j < this.cols; j++) {
        let sc = "";
        sc = sc.concat(String(i), "_", String(j));
        const cell = document.getElementById(sc) as HTMLElement;
        if (gridApp[i][j] === 0) {
          cell.setAttribute("class", "dead");
        }
        if (gridApp[i][j] === 2) {
          cell.setAttribute("class", "pre");
        }
        if (gridApp[i][j] === 1) {
          cell.setAttribute("class", "live");
        }
      }
    }
  }

  setupControlButtons() {
    this.startButton = document.getElementById("start") as HTMLElement;

    this.startButton.addEventListener("click", () => {
      this.startButtonHandler(this.startButton);
    });

    this.clearButton = document.getElementById("clear") as HTMLElement;

    this.clearButton.addEventListener("click", () => {
      this.clearButtonHandler();
    });

    const randomButton = document.getElementById("random") as HTMLElement;

    randomButton.addEventListener("click", () => {
      this.randomButtonHandler();
    });
    this.speedSelect = document.getElementById("speed") as HTMLElement;
    let listItem = document.createElement("option") as HTMLElement;
    listItem.innerText = "x1";
    this.speedSelect.append(listItem);
    listItem = document.createElement("option") as HTMLElement;
    listItem.innerText = "x2";
    this.speedSelect.append(listItem);
    listItem = document.createElement("option") as HTMLElement;
    listItem.innerText = "x4";
    this.speedSelect.append(listItem);
    this.speedSelect.addEventListener("change", (e: Event) => {
      this.speedHandler(e.target as HTMLSelectElement);
    });
    this.xValue = document.getElementById("x-ax") as HTMLInputElement;
    this.yValue = document.getElementById("y-ax") as HTMLInputElement;
    this.xValue.value = this.rows.toString();
    this.yValue.value = this.cols.toString();
  }

  randomButtonHandler() {
    if (this.playing) return;
    this.clearButtonHandler();
    for (let i = 0; i < this.rows; i++) {
      for (let j = 0; j < this.cols; j++) {
        const isLive = Math.round(Math.random());
        if (isLive === 1) {
          let sc = "";
          sc = sc.concat(String(i), "_", String(j));
          const cell = document.getElementById(sc) as HTMLTableCellElement;
          cell.setAttribute("class", "live");
          this.grid[i][j] = 1;
        }
      }
    }
    this.gameCondtition = true;
  }

  clearButtonHandler() {
    console.clear();
    if (this.xValue.value !== undefined && this.xValue.value !== "") {
      if (this.yValue.value !== undefined && this.yValue.value !== "") {
        if (this.playing === true) {
          this.playing = false;
          const newRows = Number(this.xValue.value);
          const newCols = Number(this.yValue.value);

          const newGrid = new Array(newRows);
          const newNextGrid = new Array(newRows);
          for (let i = 0; i < newRows; i++) {
            newGrid[i] = new Array(newCols);
            newNextGrid[i] = new Array(newCols);
          }

          for (let i = 0; i < newRows; i++) {
            for (let j = 0; j < newCols; j++) {
              if (i < this.rows)
                if (j < this.cols) {
                  console.log(i, j);
                  newGrid[i][j] = this.grid[i][j];
                  newNextGrid[i][j] = this.grid[i][j];
                } else {
                  newGrid[i][j] = 0;
                  newNextGrid[i][j] = 0;
                }
            }
          }
          this.rows = newRows;
          this.cols = newCols;
          this.grid = newGrid;
          this.nextGrid = newNextGrid;

          this.gridContainer.innerHTML = "";
          this.createTable();
          this.updateView(this.grid);
          this.playing = true;
        } else {
          this.playing = false;
          // const startButton = document.getElementById("start") as HTMLElement;
          this.startButton.innerHTML = "Старт";
          clearTimeout(this.timer);

          const cellsList = document.getElementsByClassName("live");

          const cells = [];
          for (let i = 0; i < cellsList.length; i++) {
            cells.push(cellsList[i]);
          }

          for (let i = 0; i < cells.length; i++) {
            cells[i].setAttribute("class", "dead");
          }
          this.resetGrids();
          this.rows = Number(this.xValue.value);
          this.cols = Number(this.yValue.value);

          this.gridContainer.innerHTML = "";

          this.grid = new Array(this.rows);

          this.nextGrid = new Array(this.rows);

          this.createTable();
          this.initializeGrids();
          this.resetGrids();
        }
      }
    }
  }

  speedHandler(e: HTMLSelectElement) {
    const speedValue = e.value;
    if (speedValue === "x1") {
      this.reproductionTime = 1000;
    }
    if (speedValue === "x2") {
      this.reproductionTime = 500;
    }
    if (speedValue === "x4") {
      this.reproductionTime = 250;
    }
  }

  startButtonHandler(e: HTMLElement) {
    this.clearButton.innerHTML = "Обновить";
    if (this.gameCondtition === true) {
      if (this.playing) {
        this.playing = false;
        e.innerHTML = "Продолжить";
        clearTimeout(this.timer);
      } else {
        this.playing = true;
        e.innerHTML = "Пауза";
        this.play(this.grid);
      }
    }
  }

  play(grid: number[][]) {
    this.computeNextGen();

    if (this.playing && this.gameCondtition === true) {
      setTimeout(() => this.play(this.grid), this.reproductionTime);
      // console.log(this.timer);
    }
  }

  computeNextGen() {
    for (let i = 0; i < this.rows; i++) {
      for (let j = 0; j < this.cols; j++) {
        this.applyRules(i, j);
      }
    }

    this.copyAndResetGrid();
    this.updateView(this.grid);

    const arr = this.grid.flat(Infinity).filter((val) => val > 0);
    console.log(arr);
    if (arr.length === 0) {
      this.gameCondtition = false;
      this.playing = false;
      // const startButton = document.getElementById("start") as HTMLElement;
      this.startButton.innerHTML = "Старт";
      // alert("Игра завершена!");
    }
  }

  applyRules(row: number, col: number) {
    const numNeighbors = this.countNeighbors(row, col);
    if (this.grid[row][col] === 1) {
      if (numNeighbors < 2) {
        this.nextGrid[row][col] = 2;
      } else if (numNeighbors === 2 || numNeighbors === 3) {
        this.nextGrid[row][col] = 1;
      } else if (numNeighbors > 3) {
        this.nextGrid[row][col] = 2;
      }
    } else if (this.grid[row][col] === 0) {
      if (numNeighbors === 3) {
        this.nextGrid[row][col] = 1;
      }
    }
    if (this.grid[row][col] === 2) {
      this.nextGrid[row][col] = 0;
    }
  }

  countNeighbors(row: number, col: number) {
    let count = 0;
    if (row - 1 >= 0) {
      if (this.grid[row - 1][col] === 1) count++;
    }
    if (row - 1 >= 0 && col - 1 >= 0) {
      if (this.grid[row - 1][col - 1] === 1) count++;
    }
    if (row - 1 >= 0 && col + 1 < this.cols) {
      if (this.grid[row - 1][col + 1] === 1) count++;
    }
    if (col - 1 >= 0) {
      if (this.grid[row][col - 1] === 1) count++;
    }
    if (col + 1 < this.cols) {
      if (this.grid[row][col + 1] === 1) count++;
    }
    if (row + 1 < this.rows) {
      if (this.grid[row + 1][col] === 1) count++;
    }
    if (row + 1 < this.rows && col - 1 >= 0) {
      if (this.grid[row + 1][col - 1] === 1) count++;
    }
    if (row + 1 < this.rows && col + 1 < this.cols) {
      if (this.grid[row + 1][col + 1] === 1) count++;
    }
    return count;
  }
}
