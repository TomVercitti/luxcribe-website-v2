import React, { useEffect, useState } from 'react';

interface NotificationProps {
  message: string | null;
}

const Notification: React.FC<NotificationProps> = ({ message }) => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (message) {
      setVisible(true);
      const timer = setTimeout(() => {
        setVisible(false);
      }, 2800); // Message visible for 2.8s
      return () => clearTimeout(timer);
    } else {
      setVisible(false);
    }
  }, [message]);
  
  if (!message) return null;

  return (
    <div
      className={`absolute top-5 left-1/2 -translate-x-1/2 bg-black bg-opacity-70 text-white px-4 py-2 rounded-lg shadow-lg transition-all duration-300 ${
        visible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-5'
      }`}
    >
      {message}
    </div>
  );
};

export default Notification;
