const generateGrid = () => {
  const grid = new Array(81).fill(0);

  const shuffle = (array) => {
    let currentIndex = array.length,
      randomIndex;

    // While there remain elements to shuffle...
    while (currentIndex != 0) {
      // Pick a remaining element...
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex--;

      // And swap it with the current element.
      [array[currentIndex], array[randomIndex]] = [
        array[randomIndex],
        array[currentIndex],
      ];
    }

    return array;
  };

  // returns the current cell's block, col, and row num
  const getSudokuVars = (i, grid) => {
    const row = Math.floor(i / 9);
    const block = Math.floor((i - row * 9) / 3) + Math.floor(row / 3) * 3;
    const col = i % 9;

    const numsInRow = grid.slice(row * 9, (row + 1) * 9);
    const numsInBlock = [];

    for (let i = 0; i < 9; i++) {
      const startVal = Math.floor(block / 3) * 27 + (block % 3) * 3 + (i % 3);
      if (i < 3) numsInBlock.push(grid[startVal]);
      else if (i > 2 && i < 6) numsInBlock.push(grid[startVal + 9]);
      else numsInBlock.push(grid[startVal + 18]);
    }
    const numsInCol = [];
    for (let i = 0; i < 9; i++) {
      numsInCol.push(grid[col + i * 9]);
    }

    return { row: numsInRow, block: numsInBlock, col: numsInCol };
  };

  const checkFull = (grid) => !grid.includes(0);

  const fillGrid = (grid) => {
    const numsToTry = [1, 2, 3, 4, 5, 6, 7, 8, 9];
    let lastIndex;
    for (let i = 0; i < grid.length; i++) {
      lastIndex = i;
      if (grid[i] === 0) {
        const { block, row, col } = getSudokuVars(i, grid);
        const shuffledNums = shuffle(numsToTry);
        for (let j = 0; j < shuffledNums.length; j++) {
          const num = shuffledNums[j];
          if (
            !block.includes(num) &&
            !row.includes(num) &&
            !col.includes(num)
          ) {
            grid[i] = num;
            if (checkFull(grid)) return true;
            else {
              if (fillGrid(grid)) return true;
            }
          }
        }
        break;
      }
    }
    grid[lastIndex] = 0;
  };

  const splitArr = (grid) => {
    const newGrid = [];

    grid.forEach((_, i) => {
      const row = Math.floor(i / 9);
      const col = Math.floor(i % 9);
      if (row % 3 === 0 && col % 3 === 0) {
        const { block } = getSudokuVars(i, grid);
        newGrid.push(block);
      }
    });

    return newGrid;
  };

  fillGrid(grid);
  return splitArr(grid);
};

const removeSudokuNumbers = (sudokuNumbers, percentToRemove) => {
  const newSudokuNumbers = sudokuNumbers.map((block) => {
    return block.map((cell) => {
      const randomNum = Math.random();
      if (randomNum > percentToRemove / 100) return cell;
      return 0;
    });
  });
  return newSudokuNumbers;
};

const init = (difficulty) => {
  const grid = generateGrid();
  console.log(removeSudokuNumbers(grid, 20));
  return {
    complete: grid,
    puzzle: removeSudokuNumbers(grid, difficulty),
  };
};

init();

module.exports = init;
