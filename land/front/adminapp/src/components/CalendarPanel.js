// src/components/CalendarPanel.js

import React, { useState } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';

const CalendarPanel = () => {
  const [date, setDate] = useState(new Date());

  return (
    <div className="text-gray-800">
      <h3 className="text-lg font-bold mb-4 text-white">Calendario</h3>
      <Calendar
        onChange={setDate}
        value={date}
      />
    </div>
  );
};

export default CalendarPanel;
