const container = document.querySelector( ".container" );
const cellNumberInput = document.querySelector( ".form-control" );
let solvedBoard;
let cellsToRemove = 40; // Number of cells to remove
const totalCells = 81; // 9 x 9 grid

// Validate number input and update cells to remove
cellNumberInput.addEventListener( "input", ( event ) => {
      const value = parseInt( event.target.value, 10 );
      if ( isNaN( value ) || value < 0 || value > 81 ) {
            alert( "Please enter a valid number between 0 and 81." );
            event.target.value = "";
      } else {
            cellsToRemove = value;
      }
} );

// Handle Enter key to reset the puzzle
cellNumberInput.addEventListener( "keydown", ( event ) => {
      if ( event.key === "Enter" ) {
            event.preventDefault();
            resetPuzzle();
      }
} );

// Function to shuffle an array (optimized Fisher-Yates shuffle)
function shuffleArray ( array ) {
      for ( let i = array.length - 1; i > 0; i-- ) {
            const j = Math.floor( Math.random() * ( i + 1 ) );
            [ array[ i ], array[ j ] ] = [ array[ j ], array[ i ] ];
      }
      return array;
}

// Optimized function to fill the Sudoku board using backtracking
function fillBoard ( board ) {
      const emptyCell = findEmptyCell( board );
      if ( !emptyCell ) return true; // Board is complete

      const [ row, col ] = emptyCell;
      const numbers = shuffleArray( [ 1, 2, 3, 4, 5, 6, 7, 8, 9 ] );

      for ( let num of numbers ) {
            if ( isValidMove( board, row, col, num ) ) {
                  board[ row ][ col ] = num;
                  if ( fillBoard( board ) ) {
                        return true;
                  }
                  board[ row ][ col ] = 0; // Backtrack
            }
      }
      return false; // No valid number found
}

// Generate a fully solved Sudoku board
function generateSolvedBoard () {
      const board = Array.from( { length: 9 }, () => Array( 9 ).fill( 0 ) );
      fillBoard( board );
      return board;
}

// Function to remove numbers to create a puzzle (improved efficiency)
function removeNumbers ( board ) {
      const puzzle = cloneBoard( board );
      let removed = 0;

      while ( removed < cellsToRemove ) {
            const row = Math.floor( Math.random() * 9 );
            const col = Math.floor( Math.random() * 9 );
            if ( puzzle[ row ][ col ] !== 0 ) {
                  puzzle[ row ][ col ] = 0;
                  removed++;
            }
      }
      return puzzle;
}

// Clone a 2D array efficiently
function cloneBoard ( board ) {
      return board.map( row => [ ...row ] );
}

// Generate a random Sudoku puzzle
function generateRandomSudoku () {
      const solved = generateSolvedBoard();
      solvedBoard = cloneBoard( solved ); // Store solved board
      return removeNumbers( solved );
}

// Find an empty cell in the Sudoku puzzle
function findEmptyCell ( board ) {
      for ( let row = 0; row < 9; row++ ) {
            for ( let col = 0; col < 9; col++ ) {
                  if ( board[ row ][ col ] === 0 ) {
                        return [ row, col ];
                  }
            }
      }
      return null; // No empty cells found
}

// Recursively solve the Sudoku puzzle (improved backtracking)
function solveHelper ( board ) {
      const emptyCell = findEmptyCell( board );
      if ( !emptyCell ) return true; // Puzzle solved

      const [ row, col ] = emptyCell;
      for ( let num = 1; num <= 9; num++ ) {
            if ( isValidMove( board, row, col, num ) ) {
                  board[ row ][ col ] = num;
                  if ( solveHelper( board ) ) return true;
                  board[ row ][ col ] = 0; // Backtrack
            }
      }
      return false; // No valid number found
}

// Function to solve the Sudoku puzzle
function solveSudoku ( board ) {
      const solvedPuzzle = cloneBoard( board );
      solveHelper( solvedPuzzle );
      return solvedPuzzle;
}

// Check if placing a number is valid
function isValidMove ( board, row, col, num ) {
      // Check the row and column
      for ( let i = 0; i < 9; i++ ) {
            if ( board[ row ][ i ] === num || board[ i ][ col ] === num ) {
                  return false;
            }
      }
      // Check the 3x3 subgrid
      const startRow = Math.floor( row / 3 ) * 3;
      const startCol = Math.floor( col / 3 ) * 3;
      for ( let i = startRow; i < startRow + 3; i++ ) {
            for ( let j = startCol; j < startCol + 3; j++ ) {
                  if ( board[ i ][ j ] === num ) {
                        return false;
                  }
            }
      }
      return true;
}

// Create the Sudoku puzzle grid in the container
function createSudokuGrid ( puzzle, solvedCells = new Set() ) {
      container.innerHTML = "";
      let numOfSolvedCells = 0;

      puzzle.forEach( ( row, rowIndex ) => {
            const rowElement = document.createElement( "div" );
            rowElement.classList.add( "row" );

            row.forEach( ( cell, columnIndex ) => {
                  let cellElement;
                  if ( cell !== 0 ) {
                        cellElement = document.createElement( "div" );
                        cellElement.classList.add( "cell" );
                        cellElement.textContent = cell;
                        if ( workingPuzzle[ rowIndex ][ columnIndex ] !== 0 ) {
                              cellElement.classList.add( "correct", "solved" );
                              numOfSolvedCells++;
                        }
                        if ( solvedCells.has( `${ rowIndex }-${ columnIndex }` ) ) {
                              cellElement.classList.add( "solvedCell" );
                        }
                  } else {
                        cellElement = document.createElement( "input" );
                        cellElement.classList.add( "cell" );
                        cellElement.maxLength = 1;
                        cellElement.type = "text";
                        cellElement.dataset.row = rowIndex;
                        cellElement.dataset.col = columnIndex;
                  }

                  const isDarkBackground =
                        ( Math.floor( rowIndex / 3 ) + Math.floor( columnIndex / 3 ) ) % 2 === 0;
                  cellElement.classList.add( isDarkBackground ? "darkBackground" : "lightBackground" );

                  rowElement.appendChild( cellElement );
            } );

            container.appendChild( rowElement );

      } );

      attachInputListeners();
      solvedNumbers.innerHTML = `You solved ${ numOfSolvedCells } out of ${ cellsToRemove } cells! <br> ${ numOfSolvedCells > Math.ceil( cellsToRemove / 2 ) ? "Great job!" : "Try again!" }`;

}

// Attach input listeners to input cells using event delegation
function attachInputListeners () {
      container.addEventListener( "input", handleInput );
}

// Handle cell input validation and user interaction
function handleInput ( event ) {
      const input = event.target;
      if ( input.tagName === "INPUT" && input.type === "text" ) {
            const value = input.value;
            const row = parseInt( input.dataset.row );
            const col = parseInt( input.dataset.col );

            if ( !/^\d?$/.test( value ) ) {
                  input.value = ""; // Clear non-numeric input
            } else {
                  const num = parseInt( value );
                  if ( num === solvedBoard[ row ][ col ] ) {
                        input.classList.add( "correct" );
                        input.classList.remove( "incorrect" );
                        workingPuzzle[ row ][ col ] = num;
                  } else {
                        input.classList.add( "incorrect" );
                        input.classList.remove( "correct" );
                  }
            }
      }
}

// Solve the current Sudoku puzzle
function solvePuzzle () {
      const solvedPuzzle = solveSudoku( puzzle );
      const solvedCells = new Set();

      // Identify solved cells
      for ( let row = 0; row < 9; row++ ) {
            const puzzleRow = puzzle[ row ];
            const solvedRow = solvedBoard[ row ];
            const workingRow = workingPuzzle[ row ];

            for ( let col = 0; col < 9; col++ ) {
                  if ( puzzleRow[ col ] === 0 && solvedRow[ col ] !== 0 && workingRow[ col ] === 0 ) {
                        solvedCells.add( `${ row }-${ col }` );
                  }
            }
      }
      createSudokuGrid( solvedPuzzle, solvedCells )
}

// Reset the puzzle
function resetPuzzle () {
      document.getElementById( "solvedNumbers" ).style.visibility = "hidden";
      initialPuzzle = generateRandomSudoku();
      puzzle = cloneBoard( initialPuzzle );
      workingPuzzle = Array.from( { length: 9 }, () => Array( 9 ).fill( 0 ) );
      solvedPuzzle = [];
      createSudokuGrid( puzzle );
}

// Initialize puzzle
let initialPuzzle = generateRandomSudoku();
let puzzle = cloneBoard( initialPuzzle );
let workingPuzzle = Array.from( { length: 9 }, () => Array( 9 ).fill( 0 ) );
let solvedPuzzle = [];

// Initial puzzle creation
createSudokuGrid( puzzle );

// Attach event listeners to buttons
document.getElementById( "solveButton" ).addEventListener( "click", () => {
      document.getElementById( "solvedNumbers" ).style.visibility = "visible";
      solvePuzzle();
} );
document.getElementById( "resetButton" ).addEventListener( "click", resetPuzzle );

const difficultyButtons = document.querySelectorAll( "#easyButton, #mediumButton, #hardButton" );

difficultyButtons.forEach( button => {
      button.addEventListener( "click", ( event ) => {
            // Reset all button background colors
            difficultyButtons.forEach( btn => btn.style.backgroundColor = "" );

            // Set the background color for the clicked button
            event.target.style.backgroundColor = "#f5957d";

            // Set cellsToRemove based on the button clicked
            switch ( event.target.id ) {
                  case "easyButton":
                        cellsToRemove = 25;
                        break;
                  case "mediumButton":
                        cellsToRemove = 40;
                        break;
                  case "hardButton":
                        cellsToRemove = 55;
                        break;
            }

            // Reset the puzzle with the new difficulty
            resetPuzzle();
      } );
} );
