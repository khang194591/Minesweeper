import { MapSize } from "../App";

function randomIntFromInterval(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}

function generate(size: MapSize) {
  console.log("Generate");

  const { row, col, bombNum } =
    size === "sm"
      ? { row: 8, col: 8, bombNum: 10 }
      : size === "md"
      ? { row: 16, col: 16, bombNum: 40 }
      : { row: 30, col: 16, bombNum: 99 };
  const blocks = [];

  for (let i = 0; i < row; i++) {
    const line = [];
    for (let j = 0; j < col; j++) {
      line.push({ isBomb: false, bomb: 0 });
    }
    blocks.push(line);
  }
  let bomb = bombNum;
  while (bomb > 0) {
    const x = randomIntFromInterval(0, col - 1);
    const y = randomIntFromInterval(0, row - 1);
    if (!blocks[x][y].isBomb) {
      blocks[x][y].isBomb = true;
      bomb--;
    }
  }

  for (let i = 0; i < row; i++) {
    for (let j = 0; j < col; j++) {
      if (!blocks[i][j].isBomb) {
        let count = 0;
        for (let x = i - 1; x <= i + 1; x++) {
          for (let y = j - 1; y <= j + 1; y++) {
            if (x < 0 || x >= col || y < 0 || y >= col) {
            } else {
              if (blocks[x][y].isBomb) {
                count++;
              }
            }
          }
          blocks[i][j].bomb = count;
        }
      }
    }
  }
  return blocks;
}

export { randomIntFromInterval, generate };
