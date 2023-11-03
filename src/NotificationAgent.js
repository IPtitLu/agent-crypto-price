import React, { useState, useEffect } from "react";

function Notification({ message, show, onClose }) {
    if (!show) {
        return null;
    }

    return (
        <div className="notification">
            {message}
            <button onClick={onClose}>X</button>
        </div>
    );
}

function useNotificationAgent(priceAnalysis) {
    const [notifications, setNotifications] = useState([]);

    useEffect(() => {
        priceAnalysis.forEach((crypto) => {
            let newNotification = null;
            if (crypto.percentageChange > 0.05) {
                newNotification = {
                    id: `${crypto.id}-up`,
                    message: `🟢 Le taux de ${
                        crypto.name
                    } a augmenté de ${crypto.percentageChange.toFixed(2)}%`,
                    date: new Date().toLocaleString(),
                };
            } else if (crypto.percentageChange < -0.05) {
                newNotification = {
                    id: `${crypto.id}-down`,
                    message: `🔴 Le taux de ${
                        crypto.name
                    } a diminué de ${crypto.percentageChange.toFixed(2)}%`,
                    date: new Date().toLocaleString(),
                };
            }

            if (newNotification) {
                setNotifications((prevNotifications) => {
                    const updatedNotifications = [
                        ...prevNotifications,
                        newNotification,
                    ];

                    if (updatedNotifications.length > 10) {
                        updatedNotifications.shift();
                    }

                    return updatedNotifications;
                });
            }
        });
    }, [priceAnalysis]);

    return [notifications, setNotifications];
}

export { useNotificationAgent, Notification };
