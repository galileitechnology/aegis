'use client';

interface TabDialogProps {
  onClose: () => void;
  onSelect: (type: 'builder' | 'labs') => void;
}

export default function TabDialog({ onClose, onSelect }: TabDialogProps) {
  return (
    <div className="dialog-overlay" onClick={onClose}>
      <div className="dialog-content" onClick={e => e.stopPropagation()}>
        <h2>Workspace</h2>
        <p>Escolha abaixo:</p>
        
        <div className="dialog-options">
          <div className="option-card" onClick={() => onSelect('builder')}>
            <div className="option-icon analytics">
              <svg width="24" height="24" viewBox="0 0 24 24">
                <rect stroke="#fff" id="svg_1" height="4.06235" width="8.06221" y="10.43667" x="1.27572" fill="none"/>
                <rect stroke="#fff" id="svg_3" height="4.06235" width="8.06221" y="18" x="13.12496" fill="none"/>
                <rect stroke="#fff" id="svg_4" height="4.06235" width="8.06221" y="2.68696" x="13.24995" fill="none"/>
                <rect stroke="#fff" id="svg_5" height="4.06235" width="8.06221" y="10.5" x="13.12496" fill="none"/>
                <line stroke="#fff" id="svg_6" y2="12.3116" x2="12.93747" y1="12.3116" x1="9.45651" fill="none"/>
                <line stroke="#fff" id="svg_7" y2="4.74938" x2="13.12496" y1="4.74938" x1="10.67719" fill="none"/>
                <line stroke="#fff" id="svg_8" y2="20.01841" x2="12.93107" y1="20.01841" x1="11.16192" fill="none"/>
                <line transform="rotate(90 11.1243 16.6499)" stroke="#fff" id="svg_9" y2="16.64995" x2="14.99757" y1="16.64995" x1="7.25099" fill="none"/>
                <line transform="rotate(90 11.1728 8.16711)" stroke="#fff" id="svg_10" y2="8.16715" x2="15.04605" y1="8.16715" x1="7.29946" fill="none"/>
              </svg>
            </div>
            <div className="option-details">
              <h3>Builder</h3>
              <p>Construa lógicas de fluxo e organização</p>
            </div>
            <span className="option-add">+</span>
          </div>
          
          <div className="option-card" onClick={() => onSelect('labs')}>
            <div className="option-icon hive">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="option-details">
              <h3>Labs</h3>
              <p>Analysis builder environment</p>
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