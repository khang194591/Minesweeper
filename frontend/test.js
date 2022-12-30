function randomIntFromInterval(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}

const row = 16;
const col = 16;
const bombNum = 40;

function generate() {
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

const blocks = generate();

for (let i = 0; i < row; i++) {
  for (let j = 0; j < col; j++) {
    if (blocks[i][j].isBomb) {
      process.stdout.write(" X ");
    } else {
      process.stdout.write(` ${blocks[i][j].bomb} `);
    }
  }
  process.stdout.write("\n");
}

{
  const index = x + (y * mapSize.x) / 6;
  const handleClick = () => {
    if (flagged[index] || (openned[index] && block.bomb !== 0)) {
    } else {
      if (block.isBomb) {
        console.log("Lose");
        return;
      }
      const arr = [...openned];
      if (block.bomb === 0) {
        const zeros: number[] = [];
        const checked: number[] = [];
        zeros.push(index);
        while (zeros.length !== 0) {
          const index = zeros.shift() as number;
          checked.push(index);
          const x = index % (mapSize.x / 6);
          const y = (index - x) / (mapSize.x / 6);
          for (let i = x - 1; i <= x + 1; i++) {
            for (let j = y - 1; j <= y + 1; j++) {
              const subIndex = i + (j * mapSize.x) / 6;
              if (
                i < 0 ||
                i >= mapSize.x / 6 ||
                j < 0 ||
                j >= mapSize.y / 6 ||
                zeros.includes(subIndex) ||
                checked.includes(subIndex)
              ) {
              } else {
                if (
                  blocks[j][i].bomb === 0 &&
                  subIndex != index
                ) {
                  zeros.push(subIndex);
                }
              }
            }
          }
          if (zeros.length > 200) {
            break;
          } else {
          }
        }
        checked.map((index) => {
          const x = index % (mapSize.x / 6);
          const y = (index - x) / (mapSize.x / 6);
          for (let i = x - 1; i <= x + 1; i++) {
            for (let j = y - 1; j <= y + 1; j++) {
              const subIndex = i + (j * mapSize.x) / 6;
              if (
                i < 0 ||
                i >= mapSize.x / 6 ||
                j < 0 ||
                j >= mapSize.y / 6
              ) {
              } else {
                arr[subIndex] = true;
              }
            }
          }
        });
      } else {
        arr[index] = true;
      }
      setOpenned(arr);
    }
  };
  const handleRightClick = () => {
    if (openned[index]) {
      const click: number[] = [];
      const x = index % (mapSize.x / 6);
      const y = (index - x) / (mapSize.x / 6);
      for (let i = x - 1; i <= x + 1; i++) {
        for (let j = y - 1; j <= y + 1; j++) {
          const subIndex = i + (j * mapSize.x) / 6;
          if (
            i < 0 ||
            i >= mapSize.x / 6 ||
            j < 0 ||
            j >= mapSize.y / 6 ||
            (i === x && j === y) ||
            flagged[subIndex]
          ) {
          } else {
            click.push(subIndex);
          }
        }
      }
      const arr = [...openned];
      click.map((item) => {
        arr[item] = true;
        document.getElementById(item.toString())?.click();
      });
      setOpenned(arr);
    } else {
      const arr = [...flagged];
      arr[index] = !arr[index];
      setFlagged(arr);
    }
  };

  // useEffect(() => {
  //   if (block.bomb === 0 && openned[index]) {
  //     document.getElementById(index.toString())?.click();
  //   }
  //   return () => {};
  // }, [openned[index]]);

  return (
    <div
      id={index.toString()}
      key={index}
      onClick={handleClick}
      onContextMenu={handleRightClick}
      className={`w-8 h-8 border flex items-center justify-center cursor-pointer ${
        openned[index] ? "bg-yellow-400" : "bg-green-400"
      } ${
        (x + y) % 2 === 0 ? "bg-opacity-80" : "bg-opacity-100"
      }`}
    >
      {flagged[index] ? (
        <Pennant2 color="red" fill="red" />
      ) : openned[index] ? (
        block.isBomb ? (
          <Bomb />
        ) : (
          `${block.bomb}`
        )
      ) : (
        <p className="hidden">
          {block.isBomb ? <Bomb /> : `${block.bomb}`}
        </p>
      )}
    </div>
  );
}