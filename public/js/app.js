const container = document.getElementById("container");
const cellNumberInput = document.querySelector(".form-control");
let solvedBoard;
let cellsToRemove = 40; // Number of cells to remove
const totalCells = 81; // 9 x 9 grid


cellNumberInput.addEventListener("input", () => {
      if (isNaN(cellNumberInput.value)) {
            alert("Please enter a number");
            event.target.value = "";
      }
      if (event.target.value >= 82) {
            alert("The number of cells removed cannot be greater than the number of cells");
            event.target.value = "";
      }
})

cellNumberInput.addEventListener("keydown", () => {
      if (event.key === "Enter") {
            cellsToRemove = cellNumberInput.value;
            cellNumberInput.value = "";
            resetPuzzle();
      }
});

// Function to shuffle an array
function shuffleArray(array) {
      for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1)); // Selects a random index from the array
            [array[i], array[j]] = [array[j], array[i]]; // Swaps the two numbers in the array
      }
      return array;
}

// Function to fill the Sudoku board
function fillBoard(board) {
      const stack = [];
      const emptyCells = [];

      for (let row = 0; row < 9; row++) {
            for (let col = 0; col < 9; col++) {
                  if (board[row][col] === 0) {
                        emptyCells.push([row, col]); // Adds the place of the empty cells into the array
                  }
            }
      }

      let index = 0;

      // there are empty cells in the puzzle
      while (index < emptyCells.length) {
            const [row, col] = emptyCells[index];
            let filled = false;

            if (!stack[index]) {
                  stack[index] = shuffleArray([1, 2, 3, 4, 5, 6, 7, 8, 9]);
            }

            while (stack[index].length > 0) {
                  const num = stack[index].pop(); // The last number from the shuffled array #1 - 9

                  if (isValidMove(board, row, col, num)) {
                        board[row][col] = num;
                        index++; // One less empty cell
                        filled = true;
                        break;
                  }
            }

            // if not a valid move
            if (!filled) {
                  stack[index] = null;
                  board[row][col] = 0;
                  index--;
            }
      }

      return board;
}

// Function to generate a fully solved Sudoku board
function generateSolvedBoard() {
      const board = Array.from({ length: 9 }, () => Array(9).fill(0));
      fillBoard(board);
      return board;
}

// Function to remove numbers to create a puzzle
function removeNumbers(board) {
      const puzzle = JSON.parse(JSON.stringify(board));
      let removedCount = 0;

      while (removedCount < cellsToRemove) {
            const row = Math.floor(Math.random() * 9);
            const col = Math.floor(Math.random() * 9);
            if (puzzle[row][col] !== 0) {
                  // Randomly remove 0's
                  puzzle[row][col] = 0;
                  removedCount++;
            }
      }

      return puzzle;
}

// Function to generate a random Sudoku puzzle
function generateRandomSudoku() {
      const solved = generateSolvedBoard();
      solvedBoard = JSON.parse(JSON.stringify(solved)); // Store solved board
      const puzzle = removeNumbers(solved);
      return puzzle;
}

// Function to find an empty cell in the Sudoku puzzle
function findEmptyCell(board) {
      for (let row = 0; row < 9; row++) {
            for (let col = 0; col < 9; col++) {
                  if (board[row][col] === 0) {
                        return [row, col];
                  }
            }
      }
      return null; // No empty cell found
}

// Helper function for solving Sudoku recursively
function solveHelper(board) {
      const emptyCell = findEmptyCell(board);
      if (!emptyCell) {
            return true; // Puzzle solved
      }

      const [row, col] = emptyCell;
      for (let num = 1; num <= 9; num++) {
            if (isValidMove(board, row, col, num)) {
                  board[row][col] = num;
                  if (solveHelper(board)) {
                        return true;
                  }
                  board[row][col] = 0; // Backtrack
            }
      }
      return false; // No valid number found for this cell
}

// Function to solve the Sudoku puzzle
function solveSudoku(board) {
      const solvedPuzzle = JSON.parse(JSON.stringify(board));
      solveHelper(solvedPuzzle);
      return solvedPuzzle;
}

function isValidMove(board, row, col, num) {
      for (let i = 0; i < 9; i++) {
            if (board[row][i] === num || board[i][col] === num) {
                  return false;
            }
      }

      const startRow = Math.floor(row / 3) * 3;
      const startCol = Math.floor(col / 3) * 3;
      for (let i = startRow; i < startRow + 3; i++) {
            for (let j = startCol; j < startCol + 3; j++) {
                  if (board[i][j] === num) {
                        return false;
                  }
            }
      }
      return true;
}

// Attach event listener to input elements dynamically
function attachInputListeners() {
      const textInputs = container.querySelectorAll("input[type='text']");
      textInputs.forEach((input) => {
            input.addEventListener("input", handleInput);
      });
}

// Function to create the Sudoku puzzle grid
function createSudokuGrid(puzzle, solvedCells) {
      container.innerHTML = "";
      let numOfSolvedCells = 0;
      puzzle.forEach((row, rowIndex) => {
            const rowElement = document.createElement("div");
            rowElement.classList.add("row");

            row.forEach((cell, columnIndex) => {
                  let cellElement;
                  if (cell !== 0) {
                        cellElement = document.createElement("div");
                        cellElement.classList.add("cell");
                        let number = document.createElement("div");
                        number.classList.add("number");
                        number.innerHTML = cell;

                        if (workingPuzzle[rowIndex][columnIndex] !== 0) {
                              cellElement.classList.add("correct");
                              cellElement.classList.add("solved");
                              numOfSolvedCells++;
                        }

                        if (solvedCells.has(`${rowIndex}-${columnIndex}`)) {
                              cellElement.classList.add("solvedCell");
                        }

                        cellElement.appendChild(number);
                  } else if (cell === 0) {
                        cellElement = document.createElement("input");
                        cellElement.classList.add("cell");
                        cellElement.maxLength = 1;
                        cellElement.type = "text";
                  }

                  const rowsPerGroup = 3; // Number of rows per group (for darkBackground or lightBackground)
                  const columnsPerGroup = 3; // Number of columns per group (for darkBackground or lightBackground)

                  // Determine the row group based on rowIndex
                  const rowGroupIndex = Math.floor(rowIndex / rowsPerGroup);

                  // Determine the column group based on columnIndex
                  const columnGroupIndex = Math.floor(columnIndex / columnsPerGroup);

                  // Determine the background color based on row group and column group
                  const isDarkBackground =
                        (rowGroupIndex % 2 === 0 && columnGroupIndex % 2 === 0) ||
                        (rowGroupIndex % 2 === 1 && columnGroupIndex % 2 === 1);

                  cellElement.classList.add(
                        isDarkBackground ? "darkBackground" : "lightBackground"
                  );

                  cellElement.setAttribute("data-row", rowIndex);
                  cellElement.setAttribute("data-col", columnIndex);
                  rowElement.appendChild(cellElement);
            });

            container.appendChild(rowElement);
      });

      // Attach event listeners to input fields after grid creation
      attachInputListeners();
      console.log(numOfSolvedCells);

      let message;
      if (numOfSolvedCells > Math.ceil(cellsToRemove / 2)) {
            message = "Great job!";
      } else if (numOfSolvedCells == cellsToRemove) {
            message = "Pefection!"
      } else {
            message = "Try again!"
      }
      document.getElementById("solvedNumbers").innerHTML = `You solved ${numOfSolvedCells} out of ${cellsToRemove} cells! </br> ${message}`;
}

// Function to solve the puzzle
function solvePuzzle() {
      const solvedBoard = solveSudoku(puzzle);
      const solvedCells = new Set();

      // Identify solved cells
      for (let row = 0; row < 9; row++) {
            for (let col = 0; col < 9; col++) {
                  if (
                        puzzle[row][col] === 0 &&
                        solvedBoard[row][col] !== 0 &&
                        workingPuzzle[row][col] === 0
                  ) {
                        solvedCells.add(`${row}-${col}`);
                  }
            }
      }
      createSudokuGrid(solvedBoard, solvedCells);
}

// Function to reset the puzzle
function resetPuzzle() {
      document.getElementById("solvedNumbers").style.visibility = "hidden";
      initialPuzzle = generateRandomSudoku();
      puzzle = JSON.parse(JSON.stringify(initialPuzzle));
      workingPuzzle = Array.from({ length: 9 }, () => Array(9).fill(0));
      // Reset working puzzle
      solvedPuzzle = [];
      const solvedCells = new Set();

      createSudokuGrid(puzzle, solvedCells);
}

// Function to check if a cell contains a valid number
const isValidNumber = (value) => /^\d?$/.test(value); // Allow empty value

// Function to validate inputs
const handleInput = (event) => {
      const input = event.target;
      const value = input.value;
      const row = parseInt(input.getAttribute("data-row"));
      const col = parseInt(input.getAttribute("data-col"));

      // Remove non-numeric characters
      if (!isValidNumber(value)) {
            input.value = ""; // Clear non-numeric input
      } else {
            const num = parseInt(value);
            if (num === solvedBoard[row][col]) {
                  input.classList.add("correct");
                  input.classList.remove("incorrect");
                  workingPuzzle[row][col] = num;
            } else {
                  input.classList.add("incorrect");
                  input.classList.remove("correct");
            }
      }
};

// Initialize puzzle
let initialPuzzle = generateRandomSudoku();
let puzzle = JSON.parse(JSON.stringify(initialPuzzle));
let workingPuzzle = Array.from({ length: 9 }, () => Array(9).fill(0));
let solvedPuzzle = [];

// Initial puzzle creation
createSudokuGrid(puzzle, new Set());

// Attach event listeners to buttons
document.getElementById("solveButton").addEventListener("click", () => {
      document.getElementById("solvedNumbers").style.visibility = "visible";
      solvePuzzle();
});
document.getElementById("resetButton").addEventListener("click", resetPuzzle);

const easyMode = document.getElementById("easyButton");
easyMode.addEventListener("click", () => {
      easyMode.style.backgroundColor = "#f5957d";
      mediumMode.style.backgroundColor = "";
      hardMode.style.backgroundColor = "";
      cellsToRemove = 25;
      resetPuzzle();
});

const mediumMode = document.getElementById("mediumButton");
mediumMode.addEventListener("click", () => {
      mediumMode.style.backgroundColor = "#f5957d";
      hardMode.style.backgroundColor = "";
      easyMode.style.backgroundColor = "";
      cellsToRemove = 40;
      resetPuzzle();
});

const hardMode = document.getElementById("hardButton");
hardMode.addEventListener("click", () => {
      hardMode.style.backgroundColor = "#f5957d";
      easyMode.style.backgroundColor = "";
      mediumMode.style.backgroundColor = "";
      cellsToRemove = 55;
      resetPuzzle();
});