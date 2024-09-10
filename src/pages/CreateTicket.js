import React, { useState } from 'react';
import axios from 'axios';
import './CreateTicket.css';  
import { useAuth0 } from '@auth0/auth0-react';

function CreateTicket() {
  const [userId, setUserId] = useState('');
  const [title, setTitle] = useState('');
  const [assignedModuleId, setAssignedModuleId] = useState('');
  const [category, setCategory] = useState('Inhaltlicher Fehler');
  const [ticketSource, setTicketSource] = useState('EXERCISE');
  const [description, setDescription] = useState('');
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const { getAccessTokenSilently } = useAuth0();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newTicket = {
      userId,
      title,
      assignedModuleId,
      category,
      ticketSource,
      description,
      status: 'ACTIVE' 
    };

    try {
      const accessToken = await getAccessTokenSilently();
      const headers = {
        'Authorization': `Bearer ${accessToken}`
      };

      axios.post('https://isef.palt.one/tickets', newTicket, {
        headers: headers
      })
        .then(response => {
          console.log('Ticket created:', response.data);
          setShowSuccessModal(true);
          // Clear form fields
          setUserId('');
          setTitle('');
          setAssignedModuleId('');
          setCategory('Inhaltlicher Fehler');
          setTicketSource('EXERCISE');
          setDescription('');
          // Remove success modal after a delay
          setTimeout(() => setShowSuccessModal(false), 5000);
        })
        .catch(error => {
          console.error('Error creating ticket:', error);
        });
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div>
      <h1>Ticket erstellen</h1>
      {showSuccessModal && (
        <div className="modal">
          <div className="modal-content">
            <span className="close" onClick={() => setShowSuccessModal(false)}>&times;</span>
            <p>Ticket erfolgreich erstellt!</p>
          </div>
        </div>
      )}
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Matrikelnummer</label>
          <input
            type="text"
            value={userId}
            onChange={e => setUserId(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label>Titel</label>
          <input
            type="text"
            value={title}
            onChange={e => setTitle(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label>Kurs</label>
          <input
            type="text"
            value={assignedModuleId}
            onChange={e => setAssignedModuleId(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label>Kategorie</label>
          <select
            name="category"
            value={category}
            onChange={e => setCategory(e.target.value)}
            required
          >
            <option value="Inhaltlicher Fehler">Inhaltlicher Fehler</option>
            <option value="Rechtschreib-/Grammatikfehler">Rechtschreib-/Grammatikfehler</option>
            <option value="Unklare Formulierung">Unklare Formulierung</option>
            <option value="Literaturangabe">Literaturangabe</option>
            <option value="Tonprobleme">Tonprobleme</option>
            <option value="Fehlende Quelle">Fehlende Quelle</option>
            <option value="Sonstiges">Sonstiges</option>
          </select>
        </div>
        <div className="form-group">
          <label>Material</label>
          <select
            name="ticketSource"
            value={ticketSource}
            onChange={e => setTicketSource(e.target.value)}
            required
          >
            <option value="EXERCISE">Übung</option>
            <option value="SCRIPT">Skript</option>
            <option value="IULEARN">IU Learn</option>
            <option value="VIDEO">Video</option>
          </select>
        </div>
        <div className="form-group">
          <label>Beschreibung</label>
          <textarea
            value={description}
            onChange={e => setDescription(e.target.value)}
            required
          />
        </div>
        <button type="submit">Erstellen</button>
      </form>
    </div>
  );
}

export default CreateTicket;
