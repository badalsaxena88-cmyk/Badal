import React from 'react';

interface VirtualCursorProps {
  position: { x: number; y: number };
}

const VirtualCursor: React.FC<VirtualCursorProps> = ({ position }) => {
  return (
    <div
      style={{
        position: 'fixed',
        top: position.y,
        left: position.x,
        width: '24px',
        height: '24px',
        backgroundColor: 'rgba(0, 122, 255, 0.7)',
        borderRadius: '50%',
        border: '2px solid white',
        boxShadow: '0 0 10px rgba(0,0,0,0.5)',
        transform: 'translate(-50%, -50%)',
        pointerEvents: 'none',
        zIndex: 9999,
        transition: 'top 0.05s linear, left 0.05s linear'
      }}
      aria-hidden="true"
    />
  );
};

export default VirtualCursor;