'use client';

import './xy-theme.css';
import React, { createContext, useContext, useState, ReactNode, useCallback } from 'react';
import { Tab } from '@/components/tabs/browser-tabs';
import { Background,ReactFlow,ReactFlowProvider,useNodesState,useEdgesState,addEdge,Controls } from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import Sidebar from './Sidebar';

export type TabType = 'builder' | 'labs';

const initialNodes = [
  {
    id: 'provider-1',
    type: 'input',
    data: { label: 'Node 1' },
    position: { x: 250, y: 5 },
  },
  { id: 'provider-2', data: { label: 'Node 2' }, position: { x: 100, y: 100 } },
  { id: 'provider-3', data: { label: 'Node 3' }, position: { x: 400, y: 100 } },
  { id: 'provider-4', data: { label: 'Node 4' }, position: { x: 400, y: 200 } },
];

const initialEdges = [
  {
    id: 'provider-e1-2',
    source: 'provider-1',
    target: 'provider-2',
    animated: true,
    type: 'step',
  },
  { id: 'provider-e1-3', 
    source: 'provider-1', 
    target: 'provider-3', 
    type: 'step',
  },
];

const BuilderContent = () => {
const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const onConnect = useCallback(
    (params:any) => setEdges((els) => addEdge(params, els)),
    [],
  );

  return (
    <div className="providerflow text-[#000] grid grid-cols-2 pl-10 pr-10 pb-2">
      <ReactFlowProvider>
        <div className="right relative border-2 border-[#303030] reactflow-wrapper h-[400px] w-[80%]">
          <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            fitView
          >
            <Controls />
            <Background />
          </ReactFlow>
          <Sidebar nodes={nodes} setNodes={setNodes}/>
        </div>
      </ReactFlowProvider>
    </div>
  );
};

// Other content components remain the same
const LabsContent = () => (
  <div>
    <h2>Labs</h2>
    <p>Experimental features and testing area...</p>
  </div>
);

const PipelinesContent = () => (
  <div>
    <h2>Data Pipelines</h2>
    <p>Manage your data pipelines here...</p>
  </div>
);

const TransformationsContent = () => (
  <div>
    <h2>Data Transformations</h2>
    <p>Manage your data transformations here...</p>
  </div>
);

const ConnectorsContent = () => (
  <div>
    <h2>Data Connectors</h2>
    <p>Manage your data connectors here...</p>
  </div>
);

const ValidationContent = () => (
  <div>
    <h2>Data Validation</h2>
    <p>Manage your data validation rules here...</p>
  </div>
);

const SchedulerContent = () => (
  <div>
    <h2>Data Scheduler</h2>
    <p>Manage your data scheduling here...</p>
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
      builder: { title: 'Builder', content: <BuilderContent /> },
      labs: { title: 'Labs', content: <LabsContent /> },
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