import React, { useState, useEffect } from 'react';
import './App.css';

function ClickCounter() {
  const [count, setCount] = useState(() => {
    const storedCount = localStorage.getItem('clickCount');
    return storedCount !== null ? parseInt(storedCount) : 0;
  });

  const [clickData, setClickData] = useState(() => {
    const storedData = localStorage.getItem('clickData');
    return storedData !== null ? JSON.parse(storedData) : {};
  });

  const handleClick = async () => {
    const position = await getCurrentPosition();
    const { latitude, longitude } = position.coords;
    const country = await getCountryName(latitude, longitude);

    const newData = { count: (clickData[country]?.count || 0) + 1 };
    setClickData({ ...clickData, [country]: newData });
    setCount(count + 1);
  };

  useEffect(() => {
    localStorage.setItem('clickCount', count.toString());
    localStorage.setItem('clickData', JSON.stringify(clickData));
  }, [count, clickData]);

  const countries = Object.keys(clickData).sort((a, b) => clickData[b].count - clickData[a].count);

  return (
    <div className="click-counter">
      <p className="count-text">Click count: {count}</p>
      <button className="click-button" onClick={handleClick}>Click me</button>
      <table className="click-table">
        <thead>
          <tr>
            <th>Country</th>
            <th>Clicks</th>
          </tr>
        </thead>
        <tbody>
          {countries.map((country) => (
            <tr key={country}>
              <td>{country}</td>
              <td>{clickData[country]?.count || 0}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

async function getCurrentPosition() {
  return new Promise((resolve, reject) => {
    navigator.geolocation.getCurrentPosition(resolve, reject);
  });
}

async function getCountryName(latitude, longitude) {
  const url = `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`;
  const response = await fetch(url);
  const data = await response.json();
  return data.countryName;
}

export default ClickCounter;
