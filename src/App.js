import { useState } from 'react';
import TemperatureChart from './charts/TemperatureChart';
import GasChart from './charts/GasChart';
import HumidityChart from './charts/HumidityChart';
import PressureChart from './charts/PressureChart';
import './style.scss'

function App() {
  const [connect, setConnect] = useState(false);

  return (
    <div className="App">
      <button onClick={() => setConnect(true)} disabled = {connect}>connect</button>
      <div className = "row">
        <div className = "column">
          <TemperatureChart name = "Altitude Chart" doConnect = {connect}/>
        </div>
        <div className = "column">
          <PressureChart name = "Altitude Chart" doConnect = {connect}/>
        </div>
      </div>
      <div className = "row">
        <div className = "column">
          <GasChart name = "Altitude Chart" doConnect = {connect}/>
        </div>
        <div className = "column">
          <HumidityChart name = "Altitude Chart" doConnect = {connect}/>
        </div>
      </div>
    </div>
  );
}

export default App;
