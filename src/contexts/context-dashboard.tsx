'use client'

import LeafletMap from '@/components/LeafletMap';
import 'leaflet/dist/leaflet.css';
import React, { createContext, useContext, useState, ReactNode, useCallback } from 'react';
import { Tab } from '@/components/tabs/browser-tabs';
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"

export type TabType = 'dashboard';

const DashboardContent = () => (
<div>
    <Sheet>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Edit profile</SheetTitle>
          <SheetDescription>
            Make changes to your profile here. Click save when you&apos;re done.
          </SheetDescription>
        </SheetHeader>
        <div className="grid flex-1 auto-rows-min gap-6 px-4">
          <div className="grid gap-3">
            <Label htmlFor="sheet-demo-name">Name</Label>
            <Input id="sheet-demo-name" defaultValue="Pedro Duarte" />
          </div>
          <div className="grid gap-3">
            <Label htmlFor="sheet-demo-username">Username</Label>
            <Input id="sheet-demo-username" defaultValue="@peduarte" />
          </div>
        </div>
        <SheetFooter>
          <Button type="submit">Save changes</Button>
          <SheetClose asChild>
            <Button variant="outline">Close</Button>
          </SheetClose>
        </SheetFooter>
      </SheetContent>
    </Sheet>
    <div 
    className="mt-6 w-[900px] overflow-hidden"
    >
    <LeafletMap 
    className="h-[400px] w-full"
    />
    </div>
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
      dashboard: { title: 'Dashboard', content: <DashboardContent /> },
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

// Main App component
export default function App() {
  return (
    <TabProvider>
      {/* Your main app content that uses tabs */}
      <div>Your app content here</div>
    </TabProvider>
  );
}

