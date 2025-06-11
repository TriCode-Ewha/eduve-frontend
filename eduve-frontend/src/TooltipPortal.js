import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';

function TooltipPortal({ targetRef, children, visible }) {
  const [coords, setCoords] = useState({ top: 0, left: 0 });

  useEffect(() => {
    if (targetRef.current && visible) {
      const rect = targetRef.current.getBoundingClientRect();
      setCoords({
        top: rect.top - 40,  // 툴팁을 버튼 위쪽에 위치시킴
        left: rect.left + rect.width / 2,
      });
    }
  }, [targetRef, visible]);

  if (!visible) return null;

  return createPortal(
    <div
      style={{
        position: 'fixed',
        top: coords.top,
        left: coords.left,
        transform: 'translateX(-50%)',
        backgroundColor: 'rgba(100, 100, 100, 0.65)',
        color: '#fff',
        padding: '8px 12px',
        borderRadius: '6px',
        fontSize: '0.70rem',
        pointerEvents: 'none',
        whiteSpace: 'nowrap',
        zIndex: 9999,
        boxShadow: '0 2px 8px rgba(0,0,0,0.3)',
      }}
    >
      {children}
    </div>,
    document.body
  );
}

export default TooltipPortal;
