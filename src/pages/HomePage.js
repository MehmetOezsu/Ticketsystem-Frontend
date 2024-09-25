import React, { useEffect } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { useNavigate } from 'react-router-dom';
import './HomePage.css'; 

function HomePage() {
  const { isAuthenticated} = useAuth0();
  const navigate = useNavigate();

  useEffect(() => {
    // Sobald der Benutzer authentifiziert ist, weiterleiten
    if (isAuthenticated) {
      navigate('/ticketlist');  // Weiterleitung zur TicketListPage
    }
  }, [isAuthenticated, navigate]);

  return (
    <div className="homepage">
      <h1>Willkommen bei IU-Korrektur</h1>
      <p>Dies ist ein System zur Verwaltung von Korrekturen. Melden Sie sich an, um fortzufahren.</p>
    </div>
  );
}

export default HomePage;
