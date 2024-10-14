import React, { useState, useEffect } from 'react';
import './DemoForm.css';
import { useAuth0 } from '@auth0/auth0-react';
import '../services/TicketForm.js'

function DemoForm() {
  const { getAccessTokenSilently } = useAuth0();
  const { token, setToken } = useState();

  useEffect(() => {
    var accessToken;
      try {
        getAccessTokenSilently().then(r => {
          accessToken = r;
          document.getElementsByTagName("ticket-form")[0].setAttribute("accesstoken",accessToken);
        });
      }
  });

  // Füge die fehlende handleSubmit Funktion hinzu
  return (
    <ticket-form accesstoken={token} backendurl="https://isef.palt.one" ></ticket-form>
  );
}

export default DemoForm;
