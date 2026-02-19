import React from 'react';
import './App.css';
import Navbar from './components/Navbar';

function App() {
  return (
    <div className="App">
      <Navbar />
      <main className="main-content">
        <section className="hero-section">
          <h1>Welcome to Classmora</h1>
          <p>Your Premium Fashion Destination</p>
        </section>
      </main>
    </div>
  );
}

export default App;
