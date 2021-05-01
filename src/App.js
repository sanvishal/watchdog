import React, { useState } from 'react';
import TemperatureChart from './charts/TemperatureChart';
import GasChart from './charts/GasChart';
import HumidityChart from './charts/HumidityChart';
import PressureChart from './charts/PressureChart';
import Header from './components/Header';

function App() {
  const [connect, setConnect] = useState(false);
  const [fighterName, setFighterName] = useState('');

  return (
    <div className="App">
      <Header isConnected={connect} fighterName={fighterName} />
      <div class="main-container">
        <div class="connection-container" style={{ display: !connect ? 'flex' : 'none' }}>
          <input
            class="fighter-name"
            placeholder="Firefighter Name"
            onChange={event => setFighterName(event.target.value)}
            onKeyPress={event => {
              if (event.key === 'Enter') {
                setConnect(true)
              }
            }} />
          <button onClick={() => setConnect(true)} disabled={connect}>
            Connect
          </button>
        </div>
        <div class="charts-container" style={{ display: connect ? 'block' : 'none' }}>
          <div class = "top-bar">
            <div class = "left">
              <div class = "title">Dashboard</div>
              <div class = "subtitle">All data about the firefighter</div>
            </div>
          </div>
          <div className="row">
            <div className="column">
              <TemperatureChart name="Temperature" doConnect={connect} />
            </div>
            <div className="column">
              <PressureChart name="Pressure" doConnect={connect} />
            </div>
          </div>
          <div className="row">
            <div className="column">
              <GasChart name="Gas Particle Matter" doConnect={connect} />
            </div>
            <div className="column">
              <HumidityChart name="Humidity" doConnect={connect} />
            </div>
          </div>
        </div>


      </div>

    </div>
  );
}

export default App;
