import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

const API_ENDPOINT = '/v1/cryptocurrency/listings/latest?limit=5';
const API_KEY = 'Votre_API_KEY';
const TAUX_CONVERSION_USD_EUR = 0.88;

function App() {
  const [data, setData] = useState([]);
  const [previousPrices, setPreviousPrices] = useState({});
  const [isFetching, setIsFetching] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(90);

  useEffect(() => {
    let timer;
    if (isFetching && timeRemaining > 0) {
      timer = setInterval(() => {
        setTimeRemaining((prevTime) => prevTime - 1);
      }, 1000);
    } else if (timeRemaining === 0) {
      fetchData();
      setTimeRemaining(90);
    }
    return () => clearInterval(timer);
  }, [isFetching, timeRemaining]);

  const fetchData = async () => {
    try {
      const response = await axios.get(API_ENDPOINT, {
        headers: {
          'X-CMC_PRO_API_KEY': API_KEY
        }
      });
      const newPreviousPrices = {};
      response.data.data.forEach((crypto) => {
        newPreviousPrices[crypto.name] = data.find(d => d.name === crypto.name)?.quote.USD.price || crypto.quote.USD.price;
      });
      setPreviousPrices(newPreviousPrices);
      setData(response.data.data);
    } catch (error) {
      console.error('Erreur lors de la récupération des données:', error);
    }
  };

  return (
    <div className="app-container">
      <p>Processus permettant d'afficher le prix des cryptos en tendance</p>
      <button
        onClick={() => {
          if (isFetching) {
            setTimeRemaining(90);
          }
          setIsFetching(!isFetching);
          if (!isFetching) fetchData();
        }}
      >
        {isFetching ? 'Arrêter la mise à jour' : 'Afficher'}
      </button>
      <div className='card-container'>
        {
          data.map((crypto) => (
            <div key={crypto.id} className="card">
              <h2>{crypto.name} ({crypto.symbol})</h2>
              <p>Prix actuel en USD: ${crypto.quote.USD.price.toFixed(2)}</p>
              <p>Prix précédent en USD: ${previousPrices[crypto.name]?.toFixed(2) || 'N/A'}</p>
              <p>Prix actuel en EUR: €{(crypto.quote.USD.price * TAUX_CONVERSION_USD_EUR).toFixed(2)}</p>
              <p>Prochaine mise à jour dans: {timeRemaining} secondes</p>
            </div>
          ))
        }
      </div>
    </div>
  );
}

export default App;