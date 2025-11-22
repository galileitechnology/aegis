'use client';

import { useState, ReactNode } from 'react';

export interface Tab {
  id: string;
  title: string;
  content: ReactNode;
  icon?: ReactNode;
}

interface BrowserTabProps {
  tabs: Tab[];
  activeTab: string | null;
  onTabChange: (id: string) => void;
  onTabClose: (id: string) => void;
  onAddTab: () => void;
  defaultContent?: ReactNode;
  keepAlive?: boolean;
}

export default function BrowserTab({
  tabs,
  activeTab,
  onTabChange,
  onTabClose,
  onAddTab,
  defaultContent,
  keepAlive = true
}: BrowserTabProps) {
  return (
    <div className="browser-tab-container">
      <div className="browser-tab-bar">
        <div className="tabs-container">
          {tabs.map(tab => (
            <div
              key={tab.id}
              className={`tab ${activeTab === tab.id ? 'active' : ''}`}
              onClick={() => onTabChange(tab.id)}
            >
              {tab.icon && <span className="tab-icon">{tab.icon}</span>}
              <span className="tab-title">{tab.title}</span>
              <button
                className="tab-close"
                onClick={(e) => {
                  e.stopPropagation();
                  onTabClose(tab.id);
                }}
                aria-label={`Close ${tab.title}`}
              >
                ✖
              </button>
            </div>
          ))}
        </div>
        <button className="add-tab-button" onClick={onAddTab} aria-label="Add new tab">
          ✚
        </button>
      </div>

      <div className="tab-content">
        {tabs.length === 0 ? (
          defaultContent
        ) : keepAlive ? (
          tabs.map(tab => (
            <div 
              key={tab.id} 
              className={`tab-pane ${activeTab === tab.id ? 'active' : ''}`}
              style={{ 
                display: activeTab === tab.id ? 'block' : 'none' 
              }}
            >
              {tab.content}
            </div>
          ))
        ) : (
          tabs.map(tab => 
            activeTab === tab.id ? (
              <div key={tab.id} className="tab-pane active">
                {tab.content}
              </div>
            ) : null
          )
        )}
      </div>
    </div>
  );
}