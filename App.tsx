
import React, { useEffect, useState } from 'react';
import { Landing } from './pages/Landing';
import { Pricing } from './pages/Pricing';
import { Security } from './pages/Security';
import { Contact } from './pages/Contact';
import { Blog } from './pages/Blog';
import { Dashboard } from './pages/AppDashboard';

const App: React.FC = () => {
  const [currentPath, setCurrentPath] = useState(window.location.hash.replace('#', '') || '/');

  useEffect(() => {
    const handleHashChange = () => {
      const path = window.location.hash.replace('#', '') || '/';
      setCurrentPath(path);
      window.scrollTo(0, 0);
    };

    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const renderRoute = () => {
    switch (currentPath) {
      case '/':
        return <Landing />;
      case '/pricing':
        return <Pricing />;
      case '/security':
        return <Security />;
      case '/contact':
        return <Contact />;
      case '/blog':
        return <Blog />;
      case '/app':
        return <Dashboard />;
      default:
        return <Landing />;
    }
  };

  return (
    <div className="antialiased font-sans bg-slate-50 min-h-screen">
      {renderRoute()}
    </div>
  );
};

export default App;
