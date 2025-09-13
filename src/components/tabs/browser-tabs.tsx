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
}

export default function BrowserTab({
  tabs,
  activeTab,
  onTabChange,
  onTabClose,
  onAddTab,
  defaultContent
}: BrowserTabProps) {
  return (
    <div className="browser-tab-container">
      {/* Tab Bar */}
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
        ) : (
          tabs.map(tab => (
            <div key={tab.id} className={activeTab === tab.id ? 'tab-pane active' : 'tab-pane'}>
              {tab.content}
            </div>
          ))
        )}
      </div>
    </div>
  );
}