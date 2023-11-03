import React from "react";
import "./NotificationList.css";

const NotificationList = ({ notifications, onDismiss }) => {
    return (
        <div
            className={`notification-list ${
                notifications.length === 0 ? "notification-list-empty" : ""
            }`}
        >
            {notifications.length === 0 ? (
                <div>Aucune notification pour le moment.</div>
            ) : (
                notifications.map((notification, index) => (
                    <div key={index} className="notification">
                        {`${notification.message} ${notification.date}`}
                    </div>
                ))
            )}
        </div>
    );
};

export default NotificationList;
