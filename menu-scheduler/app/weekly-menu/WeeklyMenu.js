"use client";

import { useState, useEffect } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { fetchDishes } from "../../utils/dishesApi";
import { saveAs } from "file-saver";
import styles from "./WeeklyMenu.module.css";

export default function WeeklyMenu() {
    const [weekStart, setWeekStart] = useState(null);
    const [menu, setMenu] = useState({});
    const [allergies, setAllergies] = useState([]);
    const [newAllergy, setNewAllergy] = useState("");
    const [dishes, setDishes] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            const fetchedDishes = await fetchDishes();
            setDishes(fetchedDishes);
        };
        fetchData();
    }, []);

    const generateMenu = () => {
        if (!weekStart) return alert("Please select a week start date!");

        const filteredDishes = dishes.filter(
            (dish) => !dish.ingredients.some((ingredient) => allergies.includes(ingredient))
        );

        const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
        const newMenu = {};
        days.forEach((day, index) => {
            newMenu[day] = filteredDishes[index % filteredDishes.length]?.name || "Day Off";
        });

        setMenu(newMenu);
    };

    const handleAddAllergy = () => {
        if (newAllergy && !allergies.includes(newAllergy)) {
            setAllergies([...allergies, newAllergy]);
            setNewAllergy("");
        }
    };

    const exportMenu = () => {
        const data = Object.entries(menu)
            .map(([day, dish]) => `${day}: ${dish}`)
            .join("\n");
        const blob = new Blob([data], { type: "text/plain;charset=utf-8" });
        saveAs(blob, "WeeklyMenu.txt");
    };

    return (
        <div className={styles.container}>
            <h1 className={styles.title}>Weekly Menu Planner</h1>
            <div className={styles.controls}>
                <div>
                    <h2>Allergies</h2>
                    <input
                        type="text"
                        value={newAllergy}
                        onChange={(e) => setNewAllergy(e.target.value)}
                        placeholder="Enter an allergy"
                    />
                    <button onClick={handleAddAllergy}>Add Allergy</button>
                    <ul>
                        {allergies.map((allergy, index) => (
                            <li key={index}>{allergy}</li>
                        ))}
                    </ul>
                </div>
                <div>
                    <h2>Select Start Date</h2>
                    <DatePicker
                        selected={weekStart}
                        onChange={(date) => setWeekStart(date)}
                        dateFormat="MM/dd/yyyy"
                    />
                    <button onClick={generateMenu}>Generate Menu</button>
                </div>
            </div>
            <div className={styles.menu}>
                <h2>Menu</h2>
                <ul>
                    {Object.entries(menu).map(([day, dish]) => (
                        <li key={day}>
                            <strong>{day}:</strong> {dish}
                        </li>
                    ))}
                </ul>
                <button onClick={exportMenu}>Export Menu</button>
            </div>
        </div>
    );
}
