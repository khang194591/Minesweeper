import { toInteger } from "lodash";
import { useEffect, useMemo, useState } from "react";
import { Bomb, Pennant2 } from "tabler-icons-react";
import { generate } from "./utils/random";

export type MapSize = "sm" | "md" | "lg";

function App() {
  const [size, setSize] = useState<MapSize>("md");
  const [mapSize, setMapSize] = useState({ x: 96, y: 96 });
  const [flag, setFlag] = useState(40);
  const [openned, setOpenned] = useState<boolean[]>(
    Array((mapSize.x * mapSize.y) / 36).fill(false)
  );
  const [flagged, setFlagged] = useState<boolean[]>(
    Array((mapSize.x * mapSize.y) / 36).fill(false)
  );
  const blocks = useMemo(() => generate(size), [size]);

  useEffect(() => {
    document.addEventListener("contextmenu", (e) => {
      e.preventDefault();
    });
    return () => {};
  }, []);

  useEffect(() => {
    if (size === "sm") {
      setMapSize({ x: 48, y: 48 });
    } else if (size === "md") {
      setMapSize({ x: 96, y: 96 });
    } else {
      setMapSize({ x: 180, y: 96 });
    }
    setFlagged(Array((mapSize.x * mapSize.y) / 36).fill(false));
    setOpenned(Array((mapSize.x * mapSize.y) / 36).fill(false));
    return () => {};
  }, [size]);

  const Block = ({
    bomb,
    isBomb,
    x,
    y,
  }: {
    bomb: number;
    isBomb: boolean;
    x: number;
    y: number;
  }) => {
    const index = x + (y * mapSize.x) / 6;
    const handleClick = () => {
      if (flagged[index] || (openned[index] && bomb !== 0)) {
      } else {
        if (isBomb) {
          console.log("Lose");
          return;
        }
        const arr = [...openned];
        if (bomb === 0) {
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
                  if (blocks[j][i].bomb === 0 && subIndex != index) {
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
        setFlag(flag - (arr[index] ? 1 : -1));
      }
    };

    return (
      <div
        id={index.toString()}
        key={index}
        onClick={handleClick}
        onContextMenu={handleRightClick}
        className={`w-8 h-8 border flex items-center justify-center cursor-pointer ${
          openned[index] ? "bg-yellow-400" : "bg-green-400"
        } ${(x + y) % 2 === 0 ? "bg-opacity-80" : "bg-opacity-100"}`}
      >
        {flagged[index] ? (
          <Pennant2 color="red" fill="red" />
        ) : openned[index] ? (
          isBomb ? (
            <Bomb />
          ) : (
            `${bomb}`
          )
        ) : (
          <p className="hidden">{isBomb ? <Bomb /> : `${bomb}`}</p>
        )}
      </div>
    );
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen w-screen bg-slate-100">
      <div className="flex flex-row items-center p-4 mx-auto my-4 bg-white">
        <select
          name=""
          id=""
          value={size}
          onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
            setSize(e.target.value as MapSize);
          }}
        >
          <option value="sm" label="Easy" />
          <option value="md">Medium</option>
          <option value="lg">Hard</option>
        </select>
        <div className="flex flex-row items-center">
          <Pennant2 color="red" fill="red" />
          <p>{flag}</p>
        </div>
      </div>
      <div
        className="flex-1"
        style={{ height: mapSize.y * 4, width: mapSize.x * 4 }}
      >
        <div className="flex flex-col flex-wrap">
          {blocks.map((rows, y) => (
            <div className="flex flex-row" key={y}>
              {rows.map((block, x) => (
                <Block {...block} x={x} y={y} key={x + (y * mapSize.x) / 6} />
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default App;
