import { useState } from 'react';
import { Navbar } from './components/Navbar';
import { Home } from './pages/Home';
import { Predict } from './pages/Predict';
import { Analytics } from './pages/Analytics';
import { PredictionResponse } from './types/Student';
import './App.css';

type Page = 'home' | 'predict' | 'analytics';

// Store prediction results globally to persist across navigation
let globalPredictionResults: PredictionResponse | null = null;

function App() {
  const [currentPage, setCurrentPage] = useState<Page>('home');
  const [predictionResults, setPredictionResults] = useState<PredictionResponse | null>(globalPredictionResults);

  const handlePageChange = (page: Page) => {
    // Save current prediction results before switching pages
    if (currentPage === 'predict' && predictionResults) {
      globalPredictionResults = predictionResults;
    }
    setCurrentPage(page);
  };

  const handleNewPrediction = () => {
    setPredictionResults(null);
    globalPredictionResults = null;
  };

  const handlePredictionComplete = (results: PredictionResponse) => {
    setPredictionResults(results);
    globalPredictionResults = results;
  };

  const renderPage = () => {
    switch (currentPage) {
      case 'home':
        return <Home onGetStarted={() => handlePageChange('predict')} />;
      case 'predict':
        return (
          <Predict 
            onPredictionComplete={handlePredictionComplete}
            existingResults={predictionResults}
            onNewPrediction={handleNewPrediction}
          />
        );
      case 'analytics':
        return <Analytics />;
      default:
        return <Home onGetStarted={() => handlePageChange('predict')} />;
    }
  };

  return (
    <div className="App">
      {currentPage !== 'home' && (
        <Navbar currentPage={currentPage} onPageChange={handlePageChange} />
      )}
      {renderPage()}
    </div>
  );
}

export default App;