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
    const doc = new jsPDF();
    let yPos = 20;
    
    doc.setFontSize(18);
    doc.text('Weekly Menu Schedule', 20, 15);
    
    doc.setFontSize(12);
    menu.forEach((dish, index) => {
      const dayName = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'][index];
      if (dish) {
        doc.text(`${dayName}: ${dish.name}`, 20, yPos);
        doc.text(`Calories: ${dish.calories}`, 20, yPos + 7);
        yPos += 20;
      } else {
        doc.text(`${dayName}: DAY OFF`, 20, yPos);
        yPos += 10;
      }
    });
    
    doc.save('weekly-menu.pdf');
  };

  const exportToExcel = () => {
    const worksheetData = menu.map((dish, index) => ({
      Day: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'][index],
      Dish: dish?.name || 'Day Off',
      Calories: dish?.calories || '-',
      Ingredients: dish?.ingredients?.join(', ') || '-'
    }));

    const ws = XLSX.utils.json_to_sheet(worksheetData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Menu");
    XLSX.writeFile(wb, "weekly-menu.xlsx");
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
        <a href="https://github.com/your-team/menu-scheduler" target="_blank" rel="noopener noreferrer">
          View Source on GitHub
        </a>
      </footer>
    </div>
  );
}

export default App;