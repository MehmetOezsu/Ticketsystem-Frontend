import React, { useState } from 'react';
import axios from 'axios';
import './CreateTicket.css'; 
import { useAuth0 } from '@auth0/auth0-react';

function CreateTicket() {
  const { user, getAccessTokenSilently } = useAuth0(); 
  const [title, setTitle] = useState('');
  const [assignedModuleId, setAssignedModuleId] = useState('');
  const [category, setCategory] = useState('Inhaltlicher Fehler');
  const [ticketSource, setTicketSource] = useState('EXERCISE');
  const [description, setDescription] = useState('');
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newTicket = {
      userEmail: user.email, 
      userName: user.name,  // Hier wird der Name über user.name gesetzt
      title,
      assignedModuleId,
      category,
      ticketSource,
      description,
      status: 'ACTIVE',
    };

    try {
      const accessToken = await getAccessTokenSilently();
      const headers = {
        Authorization: `Bearer ${accessToken}`,
      };

      await axios.post('https://isef.palt.one/tickets', newTicket, { headers });
      setShowSuccessModal(true);
      setTitle('');
      setAssignedModuleId('');
      setCategory('Inhaltlicher Fehler');
      setTicketSource('EXERCISE');
      setDescription('');
      setTimeout(() => setShowSuccessModal(false), 5000);
    } catch (error) {
      console.error('Error creating ticket:', error);
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
          <label>E-Mail</label>
          <input
            type="text"
            value={user.email}
            readOnly
            className="readonly-input"
          />
        </div>
        <div className="form-group">
          <label>Name</label> 
          <input
            type="text"
            value={user.name} 
            readOnly
            className="readonly-input"
          />
        </div>
        <div className="form-group">
          <label>Titel</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label>Modul</label>
          <input
            type="text"
            value={assignedModuleId}
            onChange={(e) => setAssignedModuleId(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label>Kategorie</label>
          <select
            name="category"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            required
          >
            <option value="CONTENT">Inhaltlicher Fehler</option>
            <option value="GRAMMAR">Rechtschreib-/Grammatikfehler</option>
            <option value="UNCLEAR">Unklare Formulierung</option>
            <option value="LITERATUR">Literaturangabe</option>
            <option value="AUDIO">Tonprobleme</option>
            <option value="MISSING_SOURCE">Fehlende Quelle</option>
            <option value="OTHER">Sonstiges</option>
          </select>
        </div>
        <div className="form-group">
          <label>Material</label>
          <select
            name="ticketSource"
            value={ticketSource}
            onChange={(e) => setTicketSource(e.target.value)}
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
            onChange={(e) => setDescription(e.target.value)}
            required
          />
        </div>
        <button type="submit">Erstellen</button>
      </form>
    </div>
  );
}

export default CreateTicket;
