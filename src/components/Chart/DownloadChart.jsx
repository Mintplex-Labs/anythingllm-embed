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
    <div className="allm-absolute allm-top-3 allm-right-3 allm-z-50 allm-cursor-pointer">
      <div className="allm-flex allm-flex-col allm-items-center">
        <div className="allm-p-1 allm-rounded-full allm-border-none">
          {loading ? (
            <CircleNotch
              className="allm-w-5 allm-h-5 allm-animate-spin"
              aria-label="Downloading image..."
            />
          ) : (
            <DownloadSimple
              weight="bold"
              className="allm-w-5 allm-h-5"
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
