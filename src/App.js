import { useState, useEffect } from 'react';
import { jsPDF } from 'jspdf';
import * as XLSX from 'xlsx';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import AllergyManager from './Components/AllergyManager';
import MenuScheduler from './Components/MenuScheduler';
import './App.css';

function App() {
  const [allergies, setAllergies] = useState([]);
  const [selectedWeek, setSelectedWeek] = useState({
    startDate: null,
    endDate: null
  });
  const [menu, setMenu] = useState(Array(7).fill(null));

  useEffect(() => {
    const saved = localStorage.getItem('allergies');
    if (saved) setAllergies(JSON.parse(saved));
  }, []);

  const getNextMonday = () => {
    const date = new Date();
    date.setDate(date.getDate() + (1 + 7 - date.getDay()) % 7);
    return date;
  };

  const exportToPDF = () => {
   
  };

  const exportToExcel = () => {
   
  };

  return (
    <div className="app">
      <header>
        <h1>🍽️ Weekly Menu Scheduler</h1>
        <div className="export-buttons">
          <button onClick={exportToPDF}>Export PDF</button>
          <button onClick={exportToExcel}>Export Excel</button>
        </div>
      </header>

      <main>
        <section className="config-section">
          <h2>⚙️ Configuration</h2>
          <div className="config-group">
            <h3>🥜 Allergy Management</h3>
            <AllergyManager allergies={allergies} setAllergies={setAllergies} />
          </div>
          
          <div className="config-group">
            <h3>📅 Week Selection</h3>
            <DatePicker
              selected={selectedWeek.startDate}
              onChange={([start, end]) => setSelectedWeek({ startDate: start, endDate: end })}
              startDate={selectedWeek.startDate}
              endDate={selectedWeek.endDate}
              selectsRange
              minDate={getNextMonday()}
              dateFormat="MM/dd/yyyy"
              placeholderText="Select a week starting Monday"
            />
          </div>
        </section>

        <section className="menu-section">
          <h2>📝 Weekly Menu</h2>
          <MenuScheduler 
            selectedWeek={selectedWeek} 
            allergies={allergies}
            menu={menu}
            setMenu={setMenu}
          />
        </section>
      </main>

      <footer>
        <a href="https://github.com/chingu-voyages/V53-tier2-team-22" target="_blank" rel="noopener noreferrer">
          View Source on GitHub
        </a>
      </footer>
    </div>
  );
}

export default App;