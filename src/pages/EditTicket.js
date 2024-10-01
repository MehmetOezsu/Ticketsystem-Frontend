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
    firstName: '',
    lastName: '',
    title: '',
    status: '',
    category: '',
    description: '',
    assignedModuleId: '',
    ticketSource: ''
  });
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const { getAccessTokenSilently, user } = useAuth0();

  // Check if the user is a Dozent (Dozenten Email: example-use@iu-studies.org)
  const isDozent = user.email === 'example-use@iu-studies.org';

  useEffect(() => {
    const fetchTicket = async () => {
      try {
        const accessToken = await getAccessTokenSilently();
        const headers = {
          'Authorization': `Bearer ${accessToken}`
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

  // Füge die fehlende handleSubmit Funktion hinzu
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const accessToken = await getAccessTokenSilently();
      const headers = {
        Authorization: `Bearer ${accessToken}`,
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
      <h1>Ticket bearbeiten</h1>
      {showSuccessModal && (
        <div className="modal">
          <div className="modal-content">
            <span className="close" onClick={() => setShowSuccessModal(false)}>&times;</span>
            <p>Ticket erfolgreich aktualisiert!</p>
          </div>
        </div>
      )}
      <form>
        <div className="form-group non-editable">
          <label>ID</label>
          <input type="text" name="id" value={ticket.id} readOnly className="readonly-input" />
        </div>
        <div className="form-group non-editable">
          <label>Erstellt am</label>
          <input type="text" name="createdAt" value={new Date(ticket.createdAt).toLocaleString()} readOnly className="readonly-input" />
        </div>
        <div className="form-group non-editable">
          <label>Bearbeitet am</label>
          <input type="text" name="updatedAt" value={new Date(ticket.updatedAt).toLocaleString()} readOnly className="readonly-input" />
        </div>
        <div className="form-group non-editable">
          <label>E-Mail</label>
          <input type="text" name="email" value={ticket.userEmail} readOnly className="readonly-input" />
        </div>
        <div className="form-group non-editable">
          <label>Vorname</label>
          <input type="text" name="firstName" value={ticket.firstName} readOnly className="readonly-input" />
        </div>
        <div className="form-group non-editable">
          <label>Nachname</label>
          <input type="text" name="lastName" value={ticket.lastName} readOnly className="readonly-input" />
        </div>
        <div className={`form-group ${isDozent ? '' : 'non-editable'}`}>
          <label>Titel</label>
          <input
            type="text"
            name="title"
            value={ticket.title}
            onChange={handleChange}
            readOnly={!isDozent}
            className={!isDozent ? 'readonly-input' : ''}
          />
        </div>
        <div className={`form-group ${isDozent ? '' : 'non-editable'}`}>
          <label>Status</label>
          <select name="status" value={ticket.status} onChange={handleChange} disabled={!isDozent} className={!isDozent ? 'readonly-input' : ''}>
            <option value="ACTIVE">Aktiv</option>
            <option value="SOLVED">Gelöst</option>
          </select>
        </div>
        <div className={`form-group ${isDozent ? '' : 'non-editable'}`}>
          <label>Kategorie</label>
          <select name="category" value={ticket.category} onChange={handleChange} disabled={!isDozent} className={!isDozent ? 'readonly-input' : ''}>
            <option value="Inhaltlicher Fehler">Inhaltlicher Fehler</option>
            <option value="Rechtschreib-/Grammatikfehler">Rechtschreib-/Grammatikfehler</option>
            <option value="Unklare Formulierung">Unklare Formulierung</option>
            <option value="Literaturangabe">Literaturangabe</option>
            <option value="Tonprobleme">Tonprobleme</option>
            <option value="Fehlende Quelle">Fehlende Quelle</option>
            <option value="Sonstiges">Sonstiges</option>
          </select>
        </div>
        <div className={`form-group ${isDozent ? '' : 'non-editable'}`}>
          <label>Beschreibung</label>
          <textarea name="description" value={ticket.description} onChange={handleChange} readOnly={!isDozent} className={!isDozent ? 'readonly-input' : ''} />
        </div>
        <div className={`form-group ${isDozent ? '' : 'non-editable'}`}>
          <label>Modul</label>
          <input type="text" name="assignedModuleId" value={ticket.assignedModuleId} onChange={handleChange} readOnly={!isDozent} className={!isDozent ? 'readonly-input' : ''} />
        </div>
        <div className={`form-group ${isDozent ? '' : 'non-editable'}`}>
          <label>Material</label>
          <select name="ticketSource" value={ticket.ticketSource} onChange={handleChange} disabled={!isDozent} className={!isDozent ? 'readonly-input' : ''}>
            <option value="EXERCISE">Übung</option>
            <option value="SCRIPT">Skript</option>
            <option value="IULEARN">IU Learn</option>
            <option value="VIDEO">Video</option>
          </select>
        </div>
        {isDozent && (
          <button type="submit" onClick={handleSubmit}>Aktualisieren</button>
        )}
      </form>
    </div>
  );
}

export default EditTicket;
