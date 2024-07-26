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

// Function to fill the Sudoku board
function fillBoard(board) {
  const stack = [];
  const emptyCells = [];

  for (let row = 0; row < 9; row++) {
    for (let col = 0; col < 9; col++) {
      if (board[row][col] === 0) {
        emptyCells.push([row, col]);
      }
    }
  }

  let index = 0;
  while (index < emptyCells.length) {
    const [row, col] = emptyCells[index];
    let filled = false;

    if (!stack[index]) {
      stack[index] = shuffleArray([1, 2, 3, 4, 5, 6, 7, 8, 9]);
    }

    while (stack[index].length > 0) {
      const num = stack[index].pop();

      if (isValidMove(board, row, col, num)) {
        board[row][col] = num;
        index++;
        filled = true;
        break;
      }
    }

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
  const cellsToRemove = 40; // Number of cells to remove
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
  solvedBoard = JSON.parse(JSON.stringify(solved)); // Store solved board
  const puzzle = removeNumbers(solved);
  return puzzle;
}

// Function to find an empty cell in the Sudoku puzzle
function findEmptyCell(board) {
  // MISSING CODE GOES HERE
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
  const textInputs = document.querySelectorAll("input[type='text']");
  textInputs.forEach((input) => {
    // MISSING CODE GOES HERE
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
document.getElementById("solveButton").addEventListener("click", solvePuzzle);
document.getElementById("resetButton").addEventListener("click", resetPuzzle);
