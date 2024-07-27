import React, { useState } from 'react';
import axios from 'axios';
import './CreateTicket.css';  // Stellen Sie sicher, dass die CSS-Datei importiert wird

function CreateTicket() {
  const [userId, setUserId] = useState('');
  const [title, setTitle] = useState('');
  const [assignedModuleId, setAssignedModuleId] = useState('');
  const [category, setCategory] = useState('');
  const [ticketSource, setTicketSource] = useState('');
  const [description, setDescription] = useState('');
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    const newTicket = {
      userId,
      title,
      assignedModuleId,
      category,
      ticketSource,
      description
    };
    axios.post('https://isef.palt.one/tickets', newTicket)
      .then(response => {
        console.log('Ticket created:', response.data);
        setShowSuccessModal(true);
        // Clear form fields
        setUserId('');
        setTitle('');
        setAssignedModuleId('');
        setCategory('');
        setTicketSource('');
        setDescription('');
        // Remove success modal after a delay
        setTimeout(() => setShowSuccessModal(false), 5000);
      })
      .catch(error => {
        console.error('Error creating ticket:', error);
      });
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
          <input
            type="text"
            value={category}
            onChange={e => setCategory(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label>Material</label>
          <input
            type="text"
            value={ticketSource}
            onChange={e => setTicketSource(e.target.value)}
            required
          />
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
