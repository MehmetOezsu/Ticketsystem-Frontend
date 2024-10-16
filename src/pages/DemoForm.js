import React, {  useEffect } from 'react';
import './DemoForm.css';
import { useAuth0 } from '@auth0/auth0-react';
import '../services/TicketForm.js'

function DemoForm() {
  const { getAccessTokenSilently } = useAuth0();

  useEffect(() => {
      try {
        getAccessTokenSilently().then(r => {
          document.getElementsByTagName("ticket-form")[0].setAttribute("accesstoken",r);
        });
      } catch (e){
        console.log(e);
      }
  });

  // Füge die fehlende handleSubmit Funktion hinzu
  return (
    <ticket-form backendurl="https://isef.palt.one" ></ticket-form>
  );
}

export default DemoForm;