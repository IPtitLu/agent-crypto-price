import React, { useState, useEffect } from "react";
import axios from "axios";
import usePriceAnalysis from "./usePriceAnalysis";
import { useNotificationAgent, Notification } from "./NotificationAgent";
import NotificationList from "./NotificationList";
import AgentActions from "./AgentActions";

import "./App.css";
import "./Notification.css";

const API_ENDPOINT = "/v1/cryptocurrency/listings/latest?limit=5";
const API_KEY = "Votre_API_KEY";
const TAUX_CONVERSION_USD_EUR = 0.88;

function App() {
    const [data, setData] = useState([]);
    const [previousPrices, setPreviousPrices] = useState({});
    const [isFetching, setIsFetching] = useState(false);
    const [timeRemaining, setTimeRemaining] = useState(90);
    const priceAnalysis = usePriceAnalysis(previousPrices, data);
    const [notification, setNotification] = useNotificationAgent(priceAnalysis);

    const dismissNotification = (id) => {
        setNotification(notification.filter((notif) => notif.id !== id));
    };

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
                    "X-CMC_PRO_API_KEY": API_KEY,
                },
            });
            const newPreviousPrices = {};
            response.data.data.forEach((crypto) => {
                newPreviousPrices[crypto.name] =
                    data.find((d) => d.name === crypto.name)?.quote.USD.price ||
                    crypto.quote.USD.price;
            });
            setPreviousPrices(newPreviousPrices);
            setData(response.data.data);
        } catch (error) {
            console.error("Erreur lors de la récupération des données:", error);
        }
    };

    function getColorClass(percentageChange) {
        if (percentageChange > 0) {
            return "positive";
        } else if (percentageChange < 0) {
            return "negative";
        } else {
            return "neutral";
        }
    }

    return (
        <div className="app-container">
            <button
                onClick={() => {
                    if (isFetching) {
                        setTimeRemaining(90);
                    }
                    setIsFetching(!isFetching);
                    if (!isFetching) fetchData();
                }}
            >
                {isFetching ? "Arrêter la mise à jour" : "Afficher"}
            </button>

            {isFetching && (
                <p>Prochaine mise à jour dans: {timeRemaining} secondes</p>
            )}

            <table className="crypto-table">
                <thead>
                    <tr>
                        <th>Nom</th>
                        <th>Symbol</th>
                        <th>Prix actuel (USD)</th>
                        <th>Prix précédent (USD)</th>
                        <th>Prix actuel (EUR)</th>
                    </tr>
                </thead>
                <tbody>
                    {data.map((crypto) => (
                        <tr key={crypto.id}>
                            <td>{crypto.name}</td>
                            <td>{crypto.symbol}</td>
                            <td>${crypto.quote.USD.price.toFixed(2)}</td>
                            <td>
                                $
                                {previousPrices[crypto.name]?.toFixed(2) ||
                                    "N/A"}
                            </td>
                            <td>
                                €
                                {(
                                    crypto.quote.USD.price *
                                    TAUX_CONVERSION_USD_EUR
                                ).toFixed(2)}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {/* Agent de calcul des taux */}
            <h2>Analyse de la variation des prix</h2>
            <div className="analysis-container">
                {priceAnalysis.map((crypto) => (
                    <div
                        key={crypto.id}
                        className={`${getColorClass(
                            crypto.percentageChange
                        )} analysis-card`}
                    >
                        <p>
                            {crypto.name} : {crypto.percentageChange.toFixed(2)}
                            %
                        </p>
                    </div>
                ))}
            </div>

            {/* Agent de notification */}
            <Notification
                message={notification.message}
                show={notification.show}
                onClose={() => setNotification({ show: false, message: "" })}
            />

            <div className="notifs-actions-container">
                {/* Liste de notifications */}
                <NotificationList
                    notifications={notification}
                    onDismiss={dismissNotification}
                />
                {/* Créer une action en fonction du taux */}
                <AgentActions priceAnalysis={priceAnalysis} />
            </div>
        </div>
    );
}

export default App;
