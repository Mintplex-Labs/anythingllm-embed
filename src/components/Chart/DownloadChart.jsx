import React, { useState } from 'react';
import { CircleNotch, DownloadSimple } from '@phosphor-icons/react';

// Download button component for chart export
function DownloadChart({ onClick }) {
  const [loading, setLoading] = useState(false);
  
  const handleClick = async () => {
    setLoading(true);
    await onClick?.();
    setLoading(false);
  };

  return (
    <div className="absolute top-3 right-3 z-50 cursor-pointer">
      <div className="flex flex-col items-center">
        <div className="p-1 rounded-full border-none">
          {loading ? (
            <CircleNotch
              className="text-theme-text-primary w-5 h-5 animate-spin"
              aria-label="Downloading image..."
            />
          ) : (
            <DownloadSimple
              weight="bold"
              className="text-theme-text-primary w-5 h-5 hover:text-theme-text-primary"
              onClick={handleClick}
              aria-label="Download graph image"
            />
          )}
        </div>
      </div>
    </div>
  );
}

export default DownloadChart;
