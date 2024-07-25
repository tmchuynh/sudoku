const container = document.getElementById("container");
let solvedBoard;

// Function to shuffle an array
function shuffleArray(array) {
      for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
      }
      return array;
}

// Recursive function to fill the Sudoku board
function fillBoard(board) {
      for (let row = 0; row < 9; row++) {
            for (let col = 0; col < 9; col++) {
                  if (board[row][col] === 0) {
                        const numbers = shuffleArray([1, 2, 3, 4, 5, 6, 7, 8, 9]);
                        for (const num of numbers) {
                              if (isValidMove(board, row, col, num)) {
                                    board[row][col] = num;
                                    if (fillBoard(board)) {
                                          return true;
                                    }
                                    board[row][col] = 0;
                              }
                        }
                        return false;
                  }
            }
      }
      return true;
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
      const cellsToRemove = 40;
      let removedCount = 0;

      while (removedCount < cellsToRemove) {
            const row = Math.floor(Math.random() * 9);
            const col = Math.floor(Math.random() * 9);
            if (puzzle[row][col] !== 0) {
                  puzzle[row][col] = 0;
                  removedCount++;
            }
      }

      return puzzle;
}

// Function to generate a random Sudoku puzzle
function generateRandomSudoku() {
      const solved = generateSolvedBoard();
      solvedBoard = JSON.parse(JSON.stringify(solved));
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
      return null;
}

// Helper function for solving Sudoku recursively
function solveHelper(board) {
      const emptyCell = findEmptyCell(board);
      if (!emptyCell) {
            return true;
      }

      const [row, col] = emptyCell;
      for (let num = 1; num <= 9; num++) {
            if (isValidMove(board, row, col, num)) {
                  board[row][col] = num;
                  if (solveHelper(board)) {
                        return true;
                  }
                  board[row][col] = 0;
            }
      }
      return false;
}

// Function to solve the Sudoku puzzle
function solveSudoku(board) {
      const solvedPuzzle = JSON.parse(JSON.stringify(board));
      solveHelper(solvedPuzzle);
      return solvedPuzzle;
}

// Function to check if a move is valid
function isValidMove(board, row, col, num) {
      // Check row
      for (let i = 0; i < 9; i++) {
            if (board[row][i] === num) {
                  return false;
            }
      }
      // Check column
      for (let i = 0; i < 9; i++) {
            if (board[i][col] === num) {
                  return false;
            }
      }
      // Check 3x3 grid
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
      const textInputs = document.querySelectorAll("input[type='text']");
      textInputs.forEach((input) => {
            input.addEventListener("input", handleInput);
      });
}

// Function to create the Sudoku puzzle grid
function createSudokuGrid(puzzle, solvedCells) {
      container.innerHTML = "";
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
                  cellElement.classList.add(
                        (rowIndex + columnIndex) % 2 === 0
                              ? "lightBackground"
                              : "darkBackground"
                  );
                  cellElement.setAttribute("data-row", rowIndex);
                  cellElement.setAttribute("data-col", columnIndex);
                  rowElement.appendChild(cellElement);
            });

            container.appendChild(rowElement);
      });

      attachInputListeners();
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
      initialPuzzle = generateRandomSudoku();
      puzzle = JSON.parse(JSON.stringify(initialPuzzle));
      workingPuzzle = Array.from({ length: 9 }, () => Array(9).fill(0));
      solvedPuzzle = [];
      const solvedCells = new Set();

      createSudokuGrid(puzzle, solvedCells);
}

// Function to check if a cell contains a valid number
const isValidNumber = (value) => /^\d?$/.test(value);

// Function to validate inputs
const handleInput = (event) => {
      const input = event.target;
      const value = input.value;
      const row = parseInt(input.getAttribute("data-row"));
      const col = parseInt(input.getAttribute("data-col"));

      if (!isValidNumber(value)) {
            input.value = "";
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

let initialPuzzle = generateRandomSudoku();
let puzzle = JSON.parse(JSON.stringify(initialPuzzle));
let workingPuzzle = Array.from({ length: 9 }, () => Array(9).fill(0));
let solvedPuzzle = [];

createSudokuGrid(puzzle, new Set());

document.getElementById("solveButton").addEventListener("click", solvePuzzle);
document.getElementById("resetButton").addEventListener("click", resetPuzzle);