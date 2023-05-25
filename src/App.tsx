import { useCallback, useEffect, useRef, useState } from 'react'
import './App.css'

function App() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isEditing, setIsEditing] = useState(true);
  const [peopleCount, setPeopleCount] = useState(2);
  const [hourlyRate, setHourlyRate] = useState(150);
  const [value, setValue] = useState(0);
  const [currency, setCurrency] = useState("HKD");
  const [currencyList, setCurrencyList] = useState([] as string[]);

  const formatter = new Intl.NumberFormat(undefined, { style: "currency", currency });

  const currencyParts = formatter.formatToParts(0);

  const cbRef = useRef(() => {});

  cbRef.current = useCallback(() => {
    const ratePerSecond = peopleCount * hourlyRate / 3600;
    setValue(value => value + ratePerSecond);
  }, [peopleCount, hourlyRate]);

  useEffect(() => {
    if (isPlaying) {
      const id = setInterval(() => cbRef.current(), 1000);

      return () => clearInterval(id);
    }
  }, [isPlaying]);

  useEffect(() => {
    try {
      setCurrencyList(Intl.supportedValuesOf("currency"));
    }
    catch (e) {}
  }, []);

  return (
    <>
      <h1 className='cost'>{formatter.format(value)}</h1>
      <button onClick={() => setIsEditing(e => !e)}>✏️</button>
      <div className="card" style={{display:isEditing?"block":"none"}}>
        <button onClick={() => setIsPlaying(isPlaying => !isPlaying)}>
          { isPlaying ? "Pause" : "Start" }
        </button>
        <button onClick={() => setValue(0)} disabled={value === 0}>
          Reset
        </button>
        <label>
          Hourly Rate{' '}
          {currencyParts[0].value}
          <input type="number" style={{width:100}} value={hourlyRate} onChange={e => setHourlyRate(e.target.valueAsNumber)} />
        </label>
        <button onClick={() => setPeopleCount((count) => count - 1)} disabled={peopleCount <= 0}>
          -1
        </button>{' '}
        {peopleCount} {peopleCount===1?"person":"people"}{' '}
        <button onClick={() => setPeopleCount((count) => count + 1)}>
          +1
        </button>
        {
          currencyList.length > 0 &&
          <label>
            Currency{' '}
            <select value={currency} onChange={e => setCurrency(e.target.value)}>
            {
              currencyList.map(c => <option key={c} value={c}>{c}</option>)
            }
            </select>
          </label>
        }
      </div>
    </>
  )
}

export default App
