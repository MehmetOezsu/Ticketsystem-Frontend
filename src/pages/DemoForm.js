import React, { useState, useEffect } from 'react';
import axiosInstance from '../api/axios';
import './DemoForm.css';
import { useAuth0 } from '@auth0/auth0-react';
import '../services/TicketForm.js'

function DemoForm() {
  const { getAccessTokenSilently, user } = useAuth0();
  const { token, setToken } = useState();

  useEffect(() => {
    const fetchTicket = async () => {
      try {
        const accessToken = await getAccessTokenSilently();
        document.getElementsByTagName("ticket-form")[0].setAttribute("accesstoken",accessToken)
        setToken(accessToken)
      }catch{
        console.log("HÄ")
      }
  }},[document, getAccessTokenSilently ,setToken]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setToken(prevState => ({
      ...prevState,
      [name]: value
    }));
  };


  // Füge die fehlende handleSubmit Funktion hinzu
  return (
    <ticket-form accesstoken={token} backendurl="https://isef.palt.one" ></ticket-form>
  );
}

export default DemoForm;
