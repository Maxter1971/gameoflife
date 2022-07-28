import "../css/style.css";

let rows = 50;
let cols = 50;

let playing = false;

const grid = new Array(rows);
const nextGrid = new Array(rows);
const gridApp = new Array(rows);

let timer;
let reproductionTime = 1000;

function initializeGrids() {
  for (let i = 0; i < rows; i++) {
    grid[i] = new Array(cols);
    nextGrid[i] = new Array(cols);
  }
}

function resetGrids() {
  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < cols; j++) {
      grid[i][j] = 0;
      nextGrid[i][j] = 0;
    }
  }
}

function copyAndResetGrid() {
  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < cols; j++) {
      grid[i][j] = nextGrid[i][j];
      nextGrid[i][j] = 0;
    }
  }
}

function copyAndResetGridNext() {
  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < cols; j++) {
      if (nextGrid[i][j] === 2) {
        nextGrid[i][j] = 0;
      }
      grid[i][j] = nextGrid[i][j];
    }
  }
}

// Initialize
function initialize() {
  // const rows = document.getElementById('x-ax');
  // const cols = document.getElementById('y-ax');
  createTable();
  initializeGrids();
  resetGrids();
  setupControlButtons();
}

// Lay out the board
function createTable() {
  const gridContainer = document.getElementById("gridContainer") as HTMLElement;
  if (!gridContainer) {
    // Throw error
    console.error("Problem: No div for the drid table!");
  }
  const table = document.createElement("table") as HTMLTableElement;

  for (let i = 0; i < rows; i++) {
    const tr = document.createElement("tr");
    for (let j = 0; j < cols; j++) {
      const cell = document.createElement("td") as HTMLTableCellElement;
      cell.setAttribute("id", `${i}_${j}`);
      cell.setAttribute("class", "dead");
      cell.onclick = cellClickHandler;
      tr.appendChild(cell);
    }
    table.appendChild(tr);
  }
  gridContainer.appendChild(table);
}

function cellClickHandler() {
  const rowcol = this.id.split("_");
  const row = rowcol[0];
  const col = rowcol[1];

  const classes = this.getAttribute("class");
  if (classes.indexOf("live") > -1) {
    this.setAttribute("class", "dead");
    grid[row][col] = 0;
  } else {
    this.setAttribute("class", "live");
    grid[row][col] = 1;
  }
}

function updateView(gridApp) {
  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < cols; j++) {
      const cell = document.getElementById(`${i}_${j}`) as HTMLElement;
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

function setupControlButtons() {
  // button to start
  const startButton = document.getElementById("start") as HTMLElement;
  startButton.onclick = startButtonHandler;

  // button to clear
  const clearButton = document.getElementById("clear") as HTMLElement;
  clearButton.onclick = clearButtonHandler;

  // button to set random initial state
  const randomButton = document.getElementById("random") as HTMLElement;
  randomButton.onclick = randomButtonHandler;
  const speedSelect = document.getElementById("speed") as HTMLElement;
  let listItem = document.createElement("option") as HTMLElement;
  listItem.innerText = "x1";
  speedSelect.append(listItem);
  listItem = document.createElement("option") as HTMLElement;
  listItem.innerText = "x2";
  speedSelect.append(listItem);
  listItem = document.createElement("option") as HTMLElement;
  listItem.innerText = "x4";
  speedSelect.append(listItem);
}

function randomButtonHandler() {
  if (playing) return;
  clearButtonHandler();
  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < cols; j++) {
      const isLive = Math.round(Math.random());
      if (isLive === 1) {
        const cell = document.getElementById(
          `${i}_${j}`
        ) as HTMLTableCellElement;
        cell.setAttribute("class", "live");
        grid[i][j] = 1;
      }
    }
  }
}

// clear the grid
function clearButtonHandler() {
  console.log("Clear the game: stop playing, clear the grid");

  playing = false;
  const startButton = document.getElementById("start") as HTMLElement;
  startButton.innerHTML = "Старт";
  clearTimeout(timer);

  const cellsList = document.getElementsByClassName("live");
  // convert to array first, otherwise, you're working on a live node list
  // and the update doesn't work!
  const cells = [];
  for (let i = 0; i < cellsList.length; i++) {
    cells.push(cellsList[i]);
  }

  for (let i = 0; i < cells.length; i++) {
    cells[i].setAttribute("class", "dead");
  }
  resetGrids();

  const xValue = document.getElementById("x-ax") as HTMLInputElement;
  const yValue = document.getElementById("y-ax") as HTMLInputElement;
  if (xValue.value !== undefined && xValue.value !== "") {
    if (yValue.value !== undefined && yValue.value !== "") {
      rows = Number(xValue.value);
      cols = Number(yValue.value);
      const gridContainer = document.getElementById(
        "gridContainer"
      ) as HTMLElement;
      gridContainer.innerHTML = "";

      createTable();
      initializeGrids();
      resetGrids();
    }
  }
}

// start/pause/continue the game
function startButtonHandler() {
  if (playing) {
    console.log("Pause the game");
    playing = false;
    this.innerHTML = "Продолжить";
    clearTimeout(timer);
  } else {
    console.log("Continue the game");
    playing = true;
    this.innerHTML = "Пауза";

    const speedSelect = document.getElementById("speed") as HTMLInputElement;
    const speedValue = speedSelect.value;
    if (speedValue === "x1") {
      reproductionTime = 1000;
    }
    if (speedValue === "x2") {
      reproductionTime = 500;
    }
    if (speedValue === "x4") {
      reproductionTime = 250;
    }
    play();
  }
}

// run the life game
function play() {
  computeNextGen();

  if (playing) {
    // copy all 1 values to "live" in the table

    timer = setTimeout(play, reproductionTime);
    console.log(timer);
  }
}

function computeNextGen() {
  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < cols; j++) {
      applyRules(i, j);
    }
  }

  // copy NextGrid to grid, and reset nextGrid

  copyAndResetGrid();
  updateView(grid);
}

// RULES
// Any live cell with fewer than two live neighbours dies, as if caused by under-population.
// Any live cell with two or three live neighbours lives on to the next generation.
// Any live cell with more than three live neighbours dies, as if by overcrowding.
// Any dead cell with exactly three live neighbours becomes a live cell, as if by reproduction.

function applyRules(row, col) {
  const numNeighbors = countNeighbors(row, col);
  if (grid[row][col] === 1) {
    if (numNeighbors < 2) {
      nextGrid[row][col] = 2;
    } else if (numNeighbors === 2 || numNeighbors === 3) {
      nextGrid[row][col] = 1;
    } else if (numNeighbors > 3) {
      nextGrid[row][col] = 2;
    }
  } else if (grid[row][col] === 0) {
    if (numNeighbors === 3) {
      nextGrid[row][col] = 1;
    }
  }
  if (grid[row][col] === 2) {
    nextGrid[row][col] = 0;
  }
}

function countNeighbors(row, col) {
  let count = 0;
  if (row - 1 >= 0) {
    if (grid[row - 1][col] === 1) count++;
  }
  if (row - 1 >= 0 && col - 1 >= 0) {
    if (grid[row - 1][col - 1] === 1) count++;
  }
  if (row - 1 >= 0 && col + 1 < cols) {
    if (grid[row - 1][col + 1] === 1) count++;
  }
  if (col - 1 >= 0) {
    if (grid[row][col - 1] === 1) count++;
  }
  if (col + 1 < cols) {
    if (grid[row][col + 1] === 1) count++;
  }
  if (row + 1 < rows) {
    if (grid[row + 1][col] === 1) count++;
  }
  if (row + 1 < rows && col - 1 >= 0) {
    if (grid[row + 1][col - 1] === 1) count++;
  }
  if (row + 1 < rows && col + 1 < cols) {
    if (grid[row + 1][col + 1] === 1) count++;
  }
  return count;
}

// Start everything
window.onload = initialize;
