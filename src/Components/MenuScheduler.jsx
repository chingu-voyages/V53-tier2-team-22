import { useEffect, useState } from 'react';
import axios from 'axios';
import DayCard from './DayCard';

const MenuScheduler = ({ selectedWeek, allergies }) => {
  const [dishes, setDishes] = useState([]);
  const [menu, setMenu] = useState(Array(7).fill(null));
  const [dayOff, setDayOff] = useState(Array(7).fill(false)); // Track days marked as "off"

  useEffect(() => {
    const fetchDishes = async () => {
      try {
        const response = await axios.get('https://menus-api.vercel.app/dishes');
        setDishes(response.data);
      } catch (error) {
        console.error("Failed to fetch dishes:", error);
      }
    };
    fetchDishes();
  }, []);

  const generateMenu = () => {
    const safeDishes = dishes.filter((dish) =>
      !dish.ingredients.some((ing) => allergies.includes(ing))
    );

    const weeklyMenu = [];
    const usedDishes = new Set();

    for (let i = 0; i < 7; i++) {
      const available = safeDishes.filter((d) => !usedDishes.has(d.name));
      if (available.length === 0) break;

      const randomIndex = Math.floor(Math.random() * available.length);
      weeklyMenu[i] = available[randomIndex];
      usedDishes.add(available[randomIndex].name);
    }

    setMenu(weeklyMenu);
  };

  const regenerateHandler = (dayIndex) => {
    const safeDishes = dishes.filter((dish) =>
      !dish.ingredients.some((ing) => allergies.includes(ing))
    );

    const usedDishes = new Set(menu.map((d) => d?.name));
    const available = safeDishes.filter((d) => !usedDishes.has(d.name));

    if (available.length > 0) {
      const randomIndex = Math.floor(Math.random() * available.length);
      const updatedMenu = [...menu];
      updatedMenu[dayIndex] = available[randomIndex];
      setMenu(updatedMenu);
    }
  };

  const dayOffHandler = (dayIndex) => {
    const updatedDayOff = [...dayOff];
    updatedDayOff[dayIndex] = !updatedDayOff[dayIndex];
    setDayOff(updatedDayOff);

    // Clear the dish for the day off
    if (updatedDayOff[dayIndex]) {
      const updatedMenu = [...menu];
      updatedMenu[dayIndex] = null;
      setMenu(updatedMenu);
    }
  };

  return (
    <div className="menu-scheduler">
      <button onClick={generateMenu}>Generate Weekly Menu</button>
      <div className="week-grid">
        {menu.map((dish, index) => (
          <DayCard
            key={index}
            day={index} // Changed from "dayIndex" to "day" for consistency
            dish={dish}
            onRegenerate={() => regenerateHandler(index)}
            onDayOff={() => dayOffHandler(index)}
            isDayOff={dayOff[index]}
          />
        ))}
      </div>
    </div>
  );
};

export default MenuScheduler;
