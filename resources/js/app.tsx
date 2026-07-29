import React from 'react';
import ReactDOM from 'react-dom/client';

function App() {
  return (
    <main>
      <h1>Kora 🌳</h1>
       <p>Modern genealogy platform</p>
    </main>
  );
}

const rootElement = document.getElementById('app');

if (!rootElement) {
  throw new Error('Root element not found.');
}

ReactDOM.createRoot(rootElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
