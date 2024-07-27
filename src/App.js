import React from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { Routes, Route } from 'react-router-dom';
import TicketListPage from './pages/TicketListPage';
import CreateTicket from './pages/CreateTicket';
import EditTicket from './pages/EditTicket';
import Header from './components/Header';

function App() {
  const { isLoading, error } = useAuth0();

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
          <Route path="/" element={<TicketListPage />} />
          <Route path="/create" element={<CreateTicket />} />
          <Route path="/edit/:id" element={<EditTicket />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;
