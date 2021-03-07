import { useState } from 'react';
import AltitudeChart from './charts/AltitudeChart';

function App() {
  const [connect, setConnect] = useState(false);

  return (
    <div className="App">
      <button onClick={() => setConnect(true)} disabled = {connect}>connect</button>
      <AltitudeChart name = "Altitude Chart" doConnect = {connect}/>
    </div>
  );
}

export default App;
