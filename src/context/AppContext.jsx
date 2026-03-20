import { createContext, useState, useEffect, useContext } from 'react';

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [eventDays, setEventDays] = useState(() => {
    const saved = localStorage.getItem('sg_eventDays');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        // Ensure old corrupt 'Day 1' or generic formatted strings are wiped to avoid crash
        const validDates = parsed.filter(d => /^\d{4}-\d{2}-\d{2}$/.test(d));
        return validDates;
      } catch (e) {
        return [];
      }
    }
    return [];
  });

  const [assistants, setAssistants] = useState(() => {
    const saved = localStorage.getItem('sg_assistants');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem('sg_eventDays', JSON.stringify(eventDays));
  }, [eventDays]);

  useEffect(() => {
    localStorage.setItem('sg_assistants', JSON.stringify(assistants));
  }, [assistants]);

  const addAssistant = (assistantData) => {
    const newAssistant = {
      ...assistantData,
      id: Date.now().toString(),
      registeredAt: new Date().toISOString()
    };
    setAssistants((prev) => [...prev, newAssistant]);
  };

  const removeAssistant = (id) => {
    setAssistants((prev) => prev.filter(a => a.id !== id));
  };
  
  const addEventDay = (day) => {
    if (!eventDays.includes(day)) {
      setEventDays([...eventDays, day]);
    }
  };

  const removeEventDay = (day) => {
    setEventDays(eventDays.filter(d => d !== day));
  };

  return (
    <AppContext.Provider value={{ 
      eventDays, 
      setEventDays,
      assistants, 
      addAssistant, 
      removeAssistant,
      addEventDay,
      removeEventDay
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => useContext(AppContext);
