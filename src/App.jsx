import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import AppRoutes from './routes/routes';
import { Toaster } from 'sonner';

function App() {
  return (
    <div>
      <Toaster 
        richColors={true}
      />
      <Router>
        <AppRoutes />
      </Router>
    </div>
  );
}

export default App;