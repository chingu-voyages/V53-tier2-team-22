import { FaRegCalendarTimes, FaSyncAlt } from 'react-icons/fa';

const DayCard = ({ day, dish, onRegenerate, onDayOff, isDayOff }) => {
  const dayNames = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

  return (
    <div className="day-card">
      <div className="day-header">
        <h3>{dayNames[day]}</h3>
        <div className="day-actions">
          <button onClick={onRegenerate} title="Regenerate dish">
            <FaSyncAlt />
          </button>
          <button 
            onClick={onDayOff} 
            title={isDayOff ? "Remove day off" : "Mark day off"}
            className={isDayOff ? "active" : ""}
          >
            <FaRegCalendarTimes />
          </button>
        </div>
      </div>
      
      {!isDayOff && dish && (
        <div className="dish-info">
          <h4>{dish.name}</h4>
          <p>Calories: {dish.calories}</p>
          <div className="ingredients">
            <strong>Ingredients:</strong>
            <ul>
              {dish.ingredients.map((ingredient, index) => (
                <li key={index}>{ingredient}</li>
              ))}
            </ul>
          </div>
        </div>
      )}
      
      {isDayOff && <div className="day-off">Day Off 🏖️</div>}
    </div>
  );
};

export default DayCard;