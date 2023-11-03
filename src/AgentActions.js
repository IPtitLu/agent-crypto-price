// AgentActions.js
import React, { useState, useEffect } from "react";
import "./AgentActions.css";

const AgentActions = ({ priceAnalysis }) => {
    const [actions, setActions] = useState([]);

    useEffect(() => {
        priceAnalysis.forEach((crypto) => {
            let newAction = null;
            const dateTimeNow = new Date().toLocaleString();
            if (crypto.percentageChange > 0.05) {
                newAction = {
                    text: `Vendu: ${
                        crypto.name
                    } à +${crypto.percentageChange.toFixed(2)}%`,
                    date: dateTimeNow,
                    type: "sell", // Ajoutez un type pour le styling
                };
            } else if (crypto.percentageChange < -0.05) {
                newAction = {
                    text: `Acheté: ${
                        crypto.name
                    } à ${crypto.percentageChange.toFixed(2)}%`,
                    date: dateTimeNow,
                    type: "buy", // Ajoutez un type pour le styling
                };
            }

            if (newAction) {
                setActions((prevActions) => {
                    const updatedActions = [...prevActions, newAction];
                    return updatedActions.length > 10
                        ? updatedActions.slice(-10)
                        : updatedActions;
                });
            }
        });
    }, [priceAnalysis]);

    return (
        <div className="agent-actions-container">
            <div className="actions-list">
                {actions.length === 0 ? (
                    <p className="no-actions">
                        Aucune action entreprise pour le moment.
                    </p>
                ) : (
                    actions.map((action, index) => (
                        <div
                            key={index}
                            className={`action-item ${action.type}`}
                        >
                            <span className="action-text">{action.text}</span>
                            <span className="action-date">{action.date}</span>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default AgentActions;
