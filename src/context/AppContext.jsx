import { createContext, useState, useEffect, useContext } from 'react';
import { supabase } from '../supabase';

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [eventDays, setEventDays] = useState([]);
  const [assistants, setAssistants] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch initial data and subscribe to real-time changes
  useEffect(() => {
    // Load event days
    const loadEventDays = async () => {
      const { data, error } = await supabase
        .from('event_days')
        .select('days')
        .eq('id', 1)
        .single();
      if (data && !error) {
        setEventDays(data.days || []);
      }
    };

    // Load assistants
    const loadAssistants = async () => {
      const { data, error } = await supabase
        .from('assistants')
        .select('*')
        .order('created_at', { ascending: true });
      if (data && !error) {
        setAssistants(data.map(a => ({
          id: a.id,
          name: a.name,
          phone: a.phone,
          gender: a.gender,
          availableDays: a.available_days || [],
          registeredAt: a.created_at
        })));
      }
      setLoading(false);
    };

    loadEventDays();
    loadAssistants();

    // Real-time subscription for assistants
    const assistantsSub = supabase
      .channel('assistants-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'assistants' }, () => {
        loadAssistants();
      })
      .subscribe();

    // Real-time subscription for event_days
    const eventDaysSub = supabase
      .channel('eventdays-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'event_days' }, () => {
        loadEventDays();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(assistantsSub);
      supabase.removeChannel(eventDaysSub);
    };
  }, []);

  // Save event days to Supabase
  const updateEventDays = async (newDays) => {
    setEventDays(newDays);
    await supabase
      .from('event_days')
      .upsert({ id: 1, days: newDays });
  };

  const addEventDay = async (day) => {
    if (!eventDays.includes(day)) {
      const newDays = [...eventDays, day];
      await updateEventDays(newDays);
    }
  };

  const removeEventDay = async (day) => {
    const newDays = eventDays.filter(d => d !== day);
    await updateEventDays(newDays);
  };

  const addAssistant = async (assistantData) => {
    const { data, error } = await supabase
      .from('assistants')
      .insert({
        name: assistantData.name,
        phone: assistantData.phone,
        gender: assistantData.gender,
        available_days: assistantData.availableDays
      })
      .select()
      .single();
    
    if (data && !error) {
      setAssistants(prev => [...prev, {
        id: data.id,
        name: data.name,
        phone: data.phone,
        gender: data.gender,
        availableDays: data.available_days || [],
        registeredAt: data.created_at
      }]);
    }
  };

  const removeAssistant = async (id) => {
    setAssistants(prev => prev.filter(a => a.id !== id));
    await supabase
      .from('assistants')
      .delete()
      .eq('id', id);
  };

  return (
    <AppContext.Provider value={{ 
      eventDays, 
      setEventDays: updateEventDays,
      assistants, 
      addAssistant, 
      removeAssistant,
      addEventDay,
      removeEventDay,
      loading
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => useContext(AppContext);
