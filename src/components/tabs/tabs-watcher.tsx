'use client';

interface TabDialogProps {
  onClose: () => void;
  onSelect: (type: 'watcher') => void;
}

export default function TabDialog({ onClose, onSelect }: TabDialogProps) {
  return (
    <div className="dialog-overlay" onClick={onClose}>
      <div className="dialog-content" onClick={e => e.stopPropagation()}>
        <h2>Workspace</h2>
        <p>Select Below:</p>
        
        <div className="dialog-options">
          <div className="option-card" onClick={() => onSelect('watcher')}>
            <div className="option-icon database">
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="800"
                    height="800"
                    fill="none"
                    stroke="#fff"
                    strokeLinecap="round"
                    viewBox="0 0 24 24"
                >
                    <rect width="20" height="20" x="2" y="2" rx="0"></rect>
                    <path d="M6 12h2l2 4 4-9 2 5h2"></path>
                </svg>
                </div>
            <div className="option-details">
              <h3>URL Monitoring</h3>
              <p>Real time deployed applications URL monitoring</p>
            </div>
            <span className="option-add">+</span>
          </div>
        </div>
        
        <div className="dialog-actions">
          <button onClick={onClose}>Cancelar</button>
        </div>
      </div>
    </div>
  );
}