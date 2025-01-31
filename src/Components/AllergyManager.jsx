import { useState, useEffect } from 'react';

const AllergyManager = ({ allergies, setAllergies }) => {
  const [newAllergy, setNewAllergy] = useState('');

  const handleAdd = () => {
    if (newAllergy && !allergies.includes(newAllergy)) {
      const updated = [...allergies, newAllergy];
      setAllergies(updated);
      localStorage.setItem('allergies', JSON.stringify(updated));
    }
    setNewAllergy('');
  };

  const handleDelete = (allergy) => {
    const updated = allergies.filter(a => a !== allergy);
    setAllergies(updated);
    localStorage.setItem('allergies', JSON.stringify(updated));
  };

  return (
    <div className="allergy-manager">
      <div className="input-group">
        <input 
          value={newAllergy}
          onChange={(e) => setNewAllergy(e.target.value)}
          placeholder="Enter allergy..."
        />
        <button onClick={handleAdd}>Add Allergy</button>
      </div>
      <div className="allergy-tags">
        {allergies.map(allergy => (
          <span key={allergy} className="tag">
            {allergy}
            <button onClick={() => handleDelete(allergy)}>×</button>
          </span>
        ))}
      </div>
    </div>
  );
};

export default AllergyManager;