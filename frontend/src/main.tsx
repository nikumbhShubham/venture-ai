import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { SocketProvider } from './context/SocketContext.tsx'; // Import the provider

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    {/* The SocketProvider gives our entire app the ability to listen for real-time events */}
    <SocketProvider>
      <App />
    </SocketProvider>
  </React.StrictMode>,
);

