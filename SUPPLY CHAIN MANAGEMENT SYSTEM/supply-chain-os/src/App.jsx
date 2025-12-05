import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Forecasting from './pages/Forecasting';
import Procurement from './pages/Procurement';
import Inventory from './pages/Inventory';
import Warehouse from './pages/Warehouse';
import Logistics from './pages/Logistics';
import Orders from './pages/Orders';
import Returns from './pages/Returns';
import Analytics from './pages/Analytics';
import SupplyChainJourney from './pages/SupplyChainJourney';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/forecasting" element={<Forecasting />} />
        <Route path="/procurement" element={<Procurement />} />
        <Route path="/inventory" element={<Inventory />} />
        <Route path="/warehouse" element={<Warehouse />} />
        <Route path="/logistics" element={<Logistics />} />
        <Route path="/orders" element={<Orders />} />
        <Route path="/returns" element={<Returns />} />
        <Route path="/analytics" element={<Analytics />} />
        <Route path="/journey" element={<SupplyChainJourney />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
