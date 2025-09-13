'use client';

interface TabDialogProps {
  onClose: () => void;
  onSelect: (type: 'dashboard') => void;
}

export default function TabDialog({ onClose, onSelect }: TabDialogProps) {
  return (
    <div className="dialog-overlay" onClick={onClose}>
      <div className="dialog-content" onClick={e => e.stopPropagation()}>
        <h2>Workspace</h2>
        <p>Escolha abaixo:</p>
        
        <div className="dialog-options">
          <div className="option-card" onClick={() => onSelect('dashboard')}>
            <div className="option-icon analytics">
              <svg width="24" height="24" viewBox="0 0 24 24">
                <line stroke="#fff" strokeWidth="3" id="svg_4" y2="18.12495" x2="3.4375" y1="6.37497" x1="3.4375" fill="none"/>
                <line stroke="#fff" strokeWidth="3" id="svg_5" y2="20.18745" x2="6.8125" y1="3.87497" x1="6.8125" fill="none"/>
                <line stroke="#fff" strokeWidth="3" id="svg_6" y2="17.06245" x2="10.24999" y1="0.74998" x1="10.24999" fill="none"/>
                <line stroke="#fff" strokeWidth="3" id="svg_7" y2="23.12494" x2="13.49998" y1="11.37496" x1="13.49998" fill="none"/>
                <line stroke="#fff" strokeWidth="3" id="svg_8" y2="12.49996" x2="16.74998" y1="0.74998" x1="16.74998" fill="none"/>
                <line stroke="#fff" strokeWidth="3" id="svg_9" y2="23.18744" x2="20.12497" y1="0.68748" x1="20.12497" fill="none"/>
              </svg>
            </div>
            <div className="option-details">
              <h3>Dashboard</h3>
              <p>Vigilância de todos os processos da Galilei</p>
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