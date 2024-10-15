import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axiosInstance from '../api/axios';
import './EditTicket.css';
import { useAuth0 } from '@auth0/auth0-react';

function EditTicket() {
  const { id } = useParams();
  const [ticket, setTicket] = useState({
    id: '',
    createdAt: '',
    updatedAt: '',
    userEmail: '',
    userName: '',
    title: '',
    status: '',
    category: '',
    description: '',
    assignedModuleId: '',
    ticketSource: ''
  });
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const { getAccessTokenSilently } = useAuth0();
  const [isDozent, setDozent] = useState(false);

  useEffect(() => {
    const fetchTicket = async () => {
      try {
        const accessToken = await getAccessTokenSilently();
        const decodedToken = JSON.parse(atob(accessToken.split('.')[1]));
        const roles = decodedToken['permissions'] || [];
        setDozent(roles.includes("tickets:manage"));

        const headers = {
          Authorization: `Bearer ${accessToken}`
        };

        const response = await axiosInstance.get(`ticket/${id}`, { headers });
        setTicket(response.data);
      } catch (error) {
        console.error('Error fetching ticket:', error);
      }
    };

    fetchTicket();
  }, [id, getAccessTokenSilently]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setTicket(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const accessToken = await getAccessTokenSilently();
      const headers = {
        Authorization: `Bearer ${accessToken}`
      };

      await axiosInstance.put(`ticket/${id}`, ticket, { headers });
      setShowSuccessModal(true);
      setTimeout(() => setShowSuccessModal(false), 5000);
    } catch (error) {
      console.error('Error updating ticket:', error);
      alert('Fehler beim Aktualisieren des Tickets: ' + (error.response ? error.response.data : error.message));
    }
  };

  return (
    <div>
      {/* Dynamische Überschrift mit Ticketnummer */}
      <h1>Ticket #{ticket.id}</h1>  
      {showSuccessModal && (
        <div className="modal">
          <div className="modal-content">
            <span className="close" onClick={() => setShowSuccessModal(false)}>&times;</span>
            <p>Ticket erfolgreich aktualisiert!</p>
          </div>
        </div>
      )}
     <form onSubmit={isDozent ? handleSubmit : undefined}>
  <div className="form-group non-editable">
    <label>ID</label>
    <input type="text" name="id" value={ticket.id} readOnly />
  </div>
  <div className="form-group non-editable">
    <label>Erstellt am</label>
    <input type="text" name="createdAt" value={new Date(ticket.createdAt).toLocaleString()} readOnly />
  </div>
  <div className="form-group non-editable">
    <label>Bearbeitet am</label>
    <input type="text" name="updatedAt" value={new Date(ticket.updatedAt).toLocaleString()} readOnly />
  </div>
  <div className="form-group non-editable">
    <label>E-Mail</label>
    <input type="text" name="userEmail" value={ticket.userEmail} readOnly />
  </div>
  <div className="form-group non-editable">
    <label>Name</label>
    <input type="text" name="userName" value={ticket.userName} readOnly />
  </div>
  <div className="form-group non-editable">
    <label>Titel</label>
    <input type="text" name="title" value={ticket.title} readOnly />
  </div>

  {/* Für Studenten ausgegraute Felder */}
  <div className={`form-group ${isDozent ? 'editable' : 'non-editable'}`}>
    <label>Status</label>
    <select name="status" value={ticket.status} onChange={handleChange} disabled={!isDozent} required>
      <option value="ACTIVE">Aktiv</option>
      <option value="SOLVED">Gelöst</option>
    </select>
  </div>
  <div className={`form-group ${isDozent ? 'editable' : 'non-editable'}`}>
    <label>Kategorie</label>
    <select name="category" value={ticket.category} onChange={handleChange} disabled={!isDozent} required>
      <option value="CONTENT">Inhaltlicher Fehler</option>
      <option value="GRAMMAR">Rechtschreib-/Grammatikfehler</option>
      <option value="UNCLEAR">Unklare Formulierung</option>
      <option value="LITERATUR">Literaturangabe</option>
      <option value="AUDIO">Tonprobleme</option>
      <option value="MISSING_SOURCE">Fehlende Quelle</option>
      <option value="OTHER">Sonstiges</option>
    </select>
  </div>
  <div className={`form-group ${isDozent ? 'editable' : 'non-editable'}`}>
    <label>Beschreibung</label>
    <textarea name="description" value={ticket.description} onChange={handleChange} disabled={!isDozent} required />
  </div>
  <div className={`form-group ${isDozent ? 'editable' : 'non-editable'}`}>
    <label>Modul</label>
    <input type="text" name="assignedModuleId" value={ticket.assignedModuleId} onChange={handleChange} disabled={!isDozent} required />
  </div>
  <div className={`form-group ${isDozent ? 'editable' : 'non-editable'}`}>
    <label>Material</label>
    <select name="ticketSource" value={ticket.ticketSource} onChange={handleChange} disabled={!isDozent} required>
      <option value="EXERCISE">Übung</option>
      <option value="SCRIPT">Skript</option>
      <option value="IULEARN">IU Learn</option>
      <option value="VIDEO">Video</option>
    </select>
  </div>

  {isDozent && <button type="submit">Aktualisieren</button>}
</form>

    </div>
  );
}

export default EditTicket;
