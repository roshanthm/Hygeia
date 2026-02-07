
import React, { useState } from 'react';
import Layout from './components/Layout';
import Home from './pages/Home';
import FakeDetection from './pages/FakeDetection';
import SafetyCheck from './pages/SafetyCheck';
import { Page } from './types';

const App: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<Page>('home');

  const navigate = (page: Page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const renderPage = () => {
    switch (currentPage) {
      case 'home':
        return <Home onNavigate={navigate} />;
      case 'fake-detection':
        return <FakeDetection onNavigate={navigate} />;
      case 'safety-check':
        return <SafetyCheck onNavigate={navigate} />;
      default:
        return <Home onNavigate={navigate} />;
    }
  };

  return (
    <Layout onNavigateHome={() => navigate('home')}>
      {renderPage()}
    </Layout>
  );
};

export default App;
