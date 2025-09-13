'use client';

import React from 'react';
import { useTabs, TabType } from '@/contexts/contexts';
import 'leaflet/dist/leaflet.css';
import { useState } from 'react';
import BrowserTab from '@/components/tabs/browser-tabs';
import TabDialog from '@/components/tabs/tabs-builder';

export default function Dashboard() {
  const { tabs, activeTab, addTab, closeTab, setActiveTab } = useTabs();
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleAddTabClick = () => {
    setIsDialogOpen(true);
  };

  const handleAddTab = (type: TabType) => {
    addTab(type);
    setIsDialogOpen(false);
  };

  const defaultContent = (
    <div className="empty-state">
      <h3>Área vazia!</h3>
      <p>Comece adicionando um espaço de trabalho</p>
      <button 
        className="primary-button"
        onClick={handleAddTabClick}
      >
        Adicionar
      </button>
    </div>
  );

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <div className='w-full h-fit'>
          <p className='text-[20px] text-[#707070]'>A E G I S &nbsp; / &nbsp; Builder</p>
        </div>
      </header>

      <BrowserTab
        tabs={tabs}
        activeTab={activeTab}
        onTabChange={setActiveTab}
        onTabClose={closeTab}
        onAddTab={handleAddTabClick}
        defaultContent={defaultContent}
      />

      {isDialogOpen && (
        <TabDialog
          onClose={() => setIsDialogOpen(false)}
          onSelect={handleAddTab}
        />
      )}
    </div>
  );
}