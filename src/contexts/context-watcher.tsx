'use client'

import React, { createContext, useContext, useState, ReactNode} from 'react';
import { Tab } from '@/components/tabs/browser-tabs';

export type TabType = 'watcher';

const DashboardContent = () => (
  <div>
    <p>text</p>
  </div>
);

interface TabContextType {
  tabs: Tab[];
  activeTab: string | null;
  addTab: (type: TabType) => void;
  closeTab: (id: string) => void;
  setActiveTab: (id: string) => void;
}

const TabContext = createContext<TabContextType | undefined>(undefined);

export function TabProvider({ children }: { children: ReactNode }) {
  const [tabs, setTabs] = useState<Tab[]>([]);
  const [activeTab, setActiveTab] = useState<string | null>(null);

  const addTab = (type: TabType) => {
    const tabConfig = {
      watcher: { title: 'URL Monitoring', content: <DashboardContent /> },
    };

    const newTab: Tab = {
      id: `${type}-${Date.now()}`,
      title: tabConfig[type].title,
      content: tabConfig[type].content
    };
    
    setTabs(prev => [...prev, newTab]);
    setActiveTab(newTab.id);
  };

  const closeTab = (id: string) => {
    const newTabs = tabs.filter(tab => tab.id !== id);
    setTabs(newTabs);
    
    if (activeTab === id) {
      if (newTabs.length > 0) {
        const closedTabIndex = tabs.findIndex(tab => tab.id === id);
        const newActiveTab = closedTabIndex > 0 ? tabs[closedTabIndex - 1].id : newTabs[0]?.id;
        setActiveTab(newActiveTab);
      } else {
        setActiveTab(null);
      }
    }
  };

  return (
    <TabContext.Provider value={{ tabs, activeTab, addTab, closeTab, setActiveTab }}>
      {children}
    </TabContext.Provider>
  );
}

export function useTabs() {
  const context = useContext(TabContext);
  if (context === undefined) {
    throw new Error('useTabs must be used within a TabProvider');
  }
  return context;
}