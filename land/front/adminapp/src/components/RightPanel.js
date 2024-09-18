// src/components/RightPanel.js

import React, { useState } from 'react';
import InfoPanel from './InfoPanel';
import NotificationsPanel from './NotificationsPanel';
import CalendarPanel from './CalendarPanel';

const RightPanel = () => {
  const [activeTab, setActiveTab] = useState('info');

  return (
    <div className="h-full flex flex-col ">
      <div className="flex space-x-2 mb-4">
      <button
          onClick={() => setActiveTab('info')}
          className={`flex-1 px-4 py-2 text-sm font-medium text-center ${
            activeTab === 'info' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'
          }`}
        >
          Información
        </button>
        <button
          onClick={() => setActiveTab('notifications')}
          className={`flex-1 px-4 py-2 text-sm font-medium text-center ${
            activeTab === 'notifications' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'
          }`}
        >
          Notificaciones
        </button>
        <button
          onClick={() => setActiveTab('calendar')}
          className={`flex-1 px-4 py-2 text-sm font-medium text-center ${
            activeTab === 'calendar' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'
          }`}
        >
          Calendario
        </button>
      </div>
      <div className="flex-grow overflow-auto">
        {activeTab === 'info' && <InfoPanel />}
        {activeTab === 'notifications' && <NotificationsPanel />}
        {activeTab === 'calendar' && <CalendarPanel />}
      </div>
    </div>
  );
};

export default RightPanel;
