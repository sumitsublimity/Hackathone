// LoadingContext.js
import React, { createContext, useContext, useState } from 'react';

const LoadingContext = createContext();

export const useLoading = () => useContext(LoadingContext);

export const LoadingProvider = ({ children }) => {
  const [isLoading, setIsLoading] = useState(false);
  const loaderRef = React.useRef(null);

  // Focus the loader when it appears
  React.useEffect(() => {
    if (isLoading && loaderRef.current) {
      loaderRef.current.focus();
    }
  }, [isLoading]);

  // Trap focus inside the loader
  React.useEffect(() => {
    if (!isLoading) return;
    const handleKeyDown = (e) => {
      if (e.key === 'Tab') {
        e.preventDefault();
        // Always keep focus on the loader
        if (loaderRef.current) loaderRef.current.focus();
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isLoading]);

  return (
    <LoadingContext.Provider value={{ isLoading, setIsLoading }}>
      <div aria-hidden={isLoading}>
        {children}
      </div>
      {isLoading && (
        <div
          ref={loaderRef}
          id="global-loader"
          tabIndex={-1}
          aria-modal="true"
          role="dialog"
          className="fixed inset-0 w-full h-full bg-black/60 flex justify-center items-center z-[9999]"
        >
          <div className="animate-spin w-10 h-10 border-4 border-peach border-t-transparent rounded-full" />
        </div>
      )}
    </LoadingContext.Provider>
  );
};
