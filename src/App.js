import React from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { Routes, Route, Navigate } from 'react-router-dom';
import TicketListPage from './pages/TicketListPage';
import CreateTicket from './pages/CreateTicket';
import EditTicket from './pages/EditTicket';
import Header from './components/Header';
import HomePage from './pages/HomePage';

function App() {
  const { isLoading, error, isAuthenticated } = useAuth0();

  if (isLoading) {
    return <div>Loading...</div>;
  }
  if (error) {
    return <div>Oops... {error.message}</div>;
  }

  return (
    <div className="App">
      <Header />
      <main>
        <Routes>
          {/* Die Startseite wird auf HomePage.js gesetzt */}
          <Route path="/" element={<HomePage />} />

          {/* Wenn eingeloggt, wird zur TicketListPage navigiert */}
          {isAuthenticated && (
            <>
              <Route path="/ticketlist" element={<TicketListPage />} />
              <Route path="/create" element={<CreateTicket />} />
              <Route path="/edit/:id" element={<EditTicket />} />
              <Route path="*" element={<Navigate to="/ticketlist" />} />
            </>
          )}
        </Routes>
      </main>
    </div>
  );
}

export default App;
