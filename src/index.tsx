import "index.sass";

import { FC, StrictMode, useEffect, useState } from "react";
import { render } from "react-dom";

interface ICitiesTests {
  cities?: ICity[];
  onClickDownload?: () => void;
}

interface ICity {
  name: string;
  region: string;
}

const CitiesTests: FC<ICitiesTests> = ({ cities = [], onClickDownload = () => { } }) => {
  const [state, setState] = useState(0);
  const current = cities[state];
  const move = (n = 0) => {
    let v = state + n;
    if (v < 0) v = cities.length - 1;
    if (v > cities.length - 1) v = 0;
    setState(v);
  };

  useEffect(() => {
    const listener = (e: KeyboardEvent) => {
      e.preventDefault();

      switch (e.key) {
        case 'ArrowLeft': {
          move(-1);
        } break;

        case 'ArrowRight': {
          move(1);
        } break;
      }
    };

    addEventListener('keydown', listener);

    return () => removeEventListener('keydown', listener);
  });

  return (
    <>
      {cities.length ? (
        <>
          <p>{current.region}</p>
          <h1>{current.name}</h1>
        </>
      ) : (
        <>
          <h1>Загрузите файл с городами</h1>
          <button onClick={onClickDownload}>Загрузить</button>
        </>
      )}
    </>
  );
};

const Main = () => {
  const [cities, setCities] = useState([] as ICity[]);

  const download = () => {
    const file = document.createElement('input');
    file.type = 'file';
    file.accept = ".txt";

    file.onchange = () => {
      const now = file.files?.[0];

      if (!now)
        return;

      now.text()
        .then(text => {
          return text
            .split(/\n+/)
            .map(e => e.trim())
            .filter(e => e)
            .map(e => e.split('=').map(e => e.trim()))
            .sort(() => Math.random() > 0.5 ? -1 : 1);
        })
        .then(rows => {
          const cities: ICity[] = [];

          for (const [name, region] of rows) {
            cities.push({ name, region });
          }

          setCities(cities);
        })
        .catch(e => {
          alert('Ошибка чтения');
          console.error(e);
        });
    };

    file.click();
  };


  return (
    <CitiesTests cities={cities} onClickDownload={download} />
  );
};

render(
  <StrictMode>
    <Main />
  </StrictMode>,
  document.getElementById('root')
);