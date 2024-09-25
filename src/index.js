import React from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter as Router } from 'react-router-dom';
import { Auth0Provider } from '@auth0/auth0-react';
import './index.css';
import App from './App';
import { UserProvider } from './UserContext';  // Pfad überprüfen

const rootElement = document.getElementById('root'); // Verwenden Sie 'root', wie es im HTML-Dokument angegeben ist

if (rootElement) {
  const root = createRoot(rootElement);

  root.render(
    <Auth0Provider
      domain="dev-isef-project.eu.auth0.com"
      clientId="87fezgW4VeyUVO2iiBPKZASk15Ah5kIi"
      authorizationParams={{
        redirect_uri: window.location.origin,
        audience:`https://project-isef.palt.one`,
        scope:"openid profile email tickets:manage tickets:read_own tickets:create",
       // prompt:'none',
      }
    }

    >
      <UserProvider>
        <Router>
          <App />
        </Router>
      </UserProvider>
    </Auth0Provider>
  );
} else {
  console.error("Target container 'root' is not a DOM element.");
}
