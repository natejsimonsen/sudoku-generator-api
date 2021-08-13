const { cloneDeep } = require("lodash");

const sudokuGrid = [
  [
    [0, 0, 0],
    [0, 0, 0],
    [0, 0, 0],
  ],
  [
    [0, 0, 0],
    [0, 0, 0],
    [0, 0, 0],
  ],
  [
    [0, 0, 0],
    [0, 0, 0],
    [0, 0, 0],
  ],
  [
    [0, 0, 0],
    [0, 0, 0],
    [0, 0, 0],
  ],
  [
    [0, 0, 0],
    [0, 0, 0],
    [0, 0, 0],
  ],
  [
    [0, 0, 0],
    [0, 0, 0],
    [0, 0, 0],
  ],
  [
    [0, 0, 0],
    [0, 0, 0],
    [0, 0, 0],
  ],
  [
    [0, 0, 0],
    [0, 0, 0],
    [0, 0, 0],
  ],
  [
    [0, 0, 0],
    [0, 0, 0],
    [0, 0, 0],
  ],
];
// general helper functions
const generateRandomNumber = (min = 1, max = 9) =>
  Math.floor(Math.random() * max) + min;

// not used now but will be when wanting to introduce randomness in the sudoku generator puzzle
const randomize = (array) => {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
};

// specific sudoku functions

// returns the numbers in the row, column, and block of the current cell
const getBlockRowsAndColumns = (blockIndex, rowNum, columnNum) => {
  const block = sudokuGrid[blockIndex];
  const rows = [];
  const columns = [];

  const topBlock = blockIndex <= 2;
  const middleBlock = blockIndex > 2 && blockIndex < 6;
  const bottomBlock = blockIndex > 5;
  const leftBlock = blockIndex % 3 === 0;
  const middleRowBlock = blockIndex % 3 === 1;
  const rightBlock = blockIndex % 3 === 2;

  let columnBlockIndex = [];
  let rowBlockIndex = [];

  if (topBlock) columnBlockIndex = [blockIndex + 3, blockIndex + 6];
  if (middleBlock) columnBlockIndex = [blockIndex - 3, blockIndex + 3];
  if (bottomBlock) columnBlockIndex = [blockIndex - 3, blockIndex - 6];
  if (leftBlock) rowBlockIndex = [blockIndex + 1, blockIndex + 2];
  if (middleRowBlock) rowBlockIndex = [blockIndex - 1, blockIndex + 1];
  if (rightBlock) rowBlockIndex = [blockIndex - 1, blockIndex - 2];

  // get all numbers in columns of current column
  columns.push(sudokuGrid[columnBlockIndex[0]][0][columnNum]);
  columns.push(sudokuGrid[columnBlockIndex[0]][1][columnNum]);
  columns.push(sudokuGrid[columnBlockIndex[0]][2][columnNum]);
  columns.push(sudokuGrid[columnBlockIndex[1]][0][columnNum]);
  columns.push(sudokuGrid[columnBlockIndex[1]][1][columnNum]);
  columns.push(sudokuGrid[columnBlockIndex[1]][2][columnNum]);

  // get all numbers in rows of current row
  rows.push(sudokuGrid[rowBlockIndex[0]][rowNum]);
  rows.push(sudokuGrid[rowBlockIndex[1]][rowNum]);
  const blockNumbers = block.flat();

  return [rows.flat(), columns, blockNumbers];
};

// generates a block of 9 random numbers
// this makes numbers the first, fourth, and last block of the sudoku
// it needs no logic other than not putting the same number in the blcok
const makeBlockRowsAndColumns = (blockIndex) => {
  let i = 0;
  const block = sudokuGrid[blockIndex];
  const numbersInBlock = [];

  while (i < 9) {
    const rowNumber = Math.floor(i / 3);
    const columnNumber = i % 3;
    const randomInt = generateRandomNumber();
    if (!numbersInBlock.includes(randomInt)) {
      block[rowNumber][columnNumber] = randomInt;
      numbersInBlock.push(randomInt);
      i++;
    }
  }

  return block;
};

// logic to solve for sudoku blocks
// this is the main engine of the sudoku engine
const solveBlockRowsAndColumns = (blockIndexes) => {
  const blocks = [];
  for (let j = 0; j < blockIndexes.length; j++) {
    let i = 0;
    const block = sudokuGrid[blockIndexes[j]];

    // generate possible solutions for every cell in block
    while (i < 9) {
      const rowNumber = Math.floor(i / 3);
      const columnNumber = i % 3;
      const sudokuNumbers = [1, 2, 3, 4, 5, 6, 7, 8, 9];
      const [row, column, numbersInBlock] = getBlockRowsAndColumns(
        blockIndexes[j],
        rowNumber,
        columnNumber
      );
      block[rowNumber][columnNumber] = [];
      const currentCell = block[rowNumber][columnNumber];
      for (const number of sudokuNumbers) {
        if (
          !numbersInBlock.includes(number) &&
          !row.includes(number) &&
          !column.includes(number)
        ) {
          currentCell.push(number);
        }
      }
      i++;
    }

    i = 0;

    const notesBlock = cloneDeep(block);
    const numbersInBlock = [];
    // numbers to exclude in current cell
    let excludeNumbers = [[], [], [], [], [], [], [], [], []];

    while (i < 9) {
      // put in first current cell that is not in the block
      const rowNumber = Math.floor(i / 3);
      const columnNumber = i % 3;
      let currentNoteCell = notesBlock[rowNumber][columnNumber];

      // recursion and try different number
      for (const number of currentNoteCell) {
        if (
          !numbersInBlock.includes(number) &&
          !excludeNumbers[i].includes(number)
        ) {
          // excludeNumbers[i] = [];
          block[rowNumber][columnNumber] = number;
          numbersInBlock.push(number);
          break;
        }
      }

      if (
        Array.isArray(block[rowNumber][columnNumber]) ||
        (block[rowNumber][columnNumber] === 0 && i > 0)
      ) {
        if (i === 0) i -= 1;
        else i -= 2;
        if (i > 0) {
          let backwardsRow = rowNumber;
          let backwardsCol = columnNumber;

          if (columnNumber === 0 && rowNumber !== 0) {
            backwardsRow--;
            backwardsCol += 2;
          } else if (rowNumber !== 0 || columnNumber !== 0) {
            backwardsCol--;
          }

          numbersInBlock.splice(-1, 1);
          excludeNumbers[i + 1].push(block[backwardsRow][backwardsCol]);
          let g = i + 2;

          while (g < excludeNumbers.length) {
            excludeNumbers[g] = [];
            g++;
          }

          block[backwardsRow][backwardsCol] = 0;
        } else {
          return [];
        }
      }

      // this fires if the block is invalid
      // if (
      //   (Array.isArray(block[rowNumber][columnNumber]) &&
      //     block[rowNumber][columnNumber].length === 0) ||
      //   (block[rowNumber][columnNumber] === 0 && i === 0)
      // ) {
      //   return;
      //   const asdf = 'asdf';
      //   j--;
      //   break;
      //   // this is a broken block move to the previous block and ignore n+1 solution and make all the next solutions back to zero
      // }

      i++;
    }

    blocks.push(block);
  }
  return blocks;
};

const removeSudokuNumbers = (sudokuNumbers) => {
  const percentToRemove = 20;
  const newSudokuNumbers = sudokuNumbers.map((block) => {
    return block.map((row) => {
      return row.map((cell) => {
        const randomNum = Math.random();
        if (randomNum > percentToRemove / 100) return cell;
        return 0;
      });
    });
  });
  return newSudokuNumbers;
};

const init = () => {
  while (true) {
    makeBlockRowsAndColumns(0);
    makeBlockRowsAndColumns(4);
    makeBlockRowsAndColumns(8);

    const arr = solveBlockRowsAndColumns([1, 2, 3, 5, 6, 7]);
    if (arr.length > 0) {
      return {
        complete: sudokuGrid,
        puzzle: removeSudokuNumbers(sudokuGrid),
      };
    }
  }
};

module.exports = init;
