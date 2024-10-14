import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './TicketListPage.css';
import axiosInstance from '../api/axios';
import { useAuth0 } from '@auth0/auth0-react';

function TicketListPage() {
  const [tickets, setTickets] = useState([]);
  const [filteredTickets, setFilteredTickets] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [modalMessage, setModalMessage] = useState('');
  const [deleteTicketId, setDeleteTicketId] = useState(null);
  const { isAuthenticated, getAccessTokenSilently} = useAuth0();
  const [isDozent, setDozent] = useState(false);

  useEffect(() => {
    if (isAuthenticated) {
      getAccessTokenSilently().then(accessToken => {
        const decodedToken = JSON.parse(atob(accessToken.split('.')[1])); 
        const roles = decodedToken['permissions'] || [];
        setDozent(roles.includes("tickets:manage"));

        const headers = {
          Authorization: `Bearer ${accessToken}`,
        };
        axiosInstance.get('tickets', { headers })
          .then(response => {
            setTickets(response.data.data);
            setFilteredTickets(response.data.data);
          })
          .catch(error => {
            console.error('Error fetching tickets:', error);
          });
      }).catch(error => {
        console.error('Error retrieving access token:', error);
      });
    }
  }, [isAuthenticated, getAccessTokenSilently]);

  useEffect(() => {
    if (searchTerm === '') {
      setFilteredTickets(tickets);
    } else {
      setFilteredTickets(tickets.filter(ticket =>
        ticket.assignedModuleId.toLowerCase().includes(searchTerm.toLowerCase())
      ));
    }
  }, [searchTerm, tickets]);

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleDelete = (id) => {
    setDeleteTicketId(id);
    setShowConfirmModal(true);
  };

  const confirmDelete = async () => {
    try {
      const accessToken = await getAccessTokenSilently();
      const headers = {
        Authorization: `Bearer ${accessToken}`,
      };

      axiosInstance.delete(`ticket/${deleteTicketId}`, { headers })
        .then(response => {
          setTickets(tickets.filter(ticket => ticket.id !== deleteTicketId));
          setFilteredTickets(filteredTickets.filter(ticket => ticket.id !== deleteTicketId));
          setModalMessage('Ticket erfolgreich gelöscht!');
          setShowSuccessModal(true);
          setShowConfirmModal(false);
          setTimeout(() => setShowSuccessModal(false), 5000);
        })
        .catch(error => {
          console.error('Error deleting ticket:', error.response ? error.response.data : error.message);
          alert('Fehler beim Löschen des Tickets: ' + (error.response ? error.response.data : error.message));
        });
    } catch (error) {
      console.error('Error obtaining access token:', error);
      alert('Fehler beim Abrufen des Zugriffstokens: ' + error.message);
    }
  };

  const cancelDelete = () => {
    setShowConfirmModal(false);
    setDeleteTicketId(null);
  };

  // Funktion zur Übersetzung der Statuswerte
  const translateStatus = (status) => {
    switch (status) {
      case 'ACTIVE':
        return 'Aktiv';
      case 'SOLVED':
        return 'Gelöst';
      default:
        return status;
    }
  };

  // Funktion zur Übersetzung der Materialwerte
  const translateMaterial = (source) => {
    switch (source) {
      case 'IULEARN':
        return 'IU Learn';
      case 'SCRIPT':
        return 'Skript';
      case 'EXERCISE':
        return 'Übung';
      case 'VIDEO':
        return 'Video';
      default:
        return source;
    }
  };

  return (
    <div>
      <h1>Ticketliste</h1>
      {showSuccessModal && (
        <div className="modal">
          <div className="modal-content">
            <span className="close" onClick={() => setShowSuccessModal(false)}>&times;</span>
            <p>{modalMessage}</p>
          </div>
        </div>
      )}
      {showConfirmModal && (
        <div className="modal">
          <div className="modal-content">
            <p>Sind Sie sicher, dass Sie dieses Ticket löschen möchten?</p>
            <button onClick={confirmDelete} className="button confirm-button" style={{ backgroundColor: '#f19832', color: 'black' }}>Ja</button>
            <button onClick={cancelDelete} className="button cancel-button" style={{ backgroundColor: '#f19832', color: 'black' }}>Nein</button>
          </div>
        </div>
      )}
      <div className="filterContainer">
        <label htmlFor="moduleSearch">Suche nach Modul: </label>
        <input
          id="moduleSearch"
          type="text"
          value={searchTerm}
          onChange={handleSearchChange}
          placeholder="Modul eingeben"
          className="input"
        />
      </div>
      <table className="table">
        <thead>
          <tr>
            <th className="th">ID</th>
            <th className="th">Erstellt am</th>
            <th className="th">Bearbeitet am</th>
            <th className="th">E-Mail</th>
            <th className="th">Name</th>
            <th className="th">Titel</th>
            <th className="th">Status</th>
            <th className="th">Kategorie</th>
            <th className="th">Beschreibung</th>
            <th className="th">Modul</th>
            <th className="th">Material</th>
            <th className="th">Aktionen</th>
          </tr>
        </thead>
        <tbody className="tbody">
          {filteredTickets.map(ticket => (
            <tr key={ticket.id} className="tr">
              <td className="td">{ticket.id}</td>
              <td className="td">{new Date(ticket.createdAt).toLocaleString()}</td>
              <td className="td">{new Date(ticket.updatedAt).toLocaleString()}</td>
              <td className="td">{ticket.userEmail}</td>
              <td className="td">{ticket.userName}</td>  
              <td className="td">{ticket.title}</td>
              <td className="td">{translateStatus(ticket.status)}</td> {/* Status übersetzt */}
              <td className="td">{ticket.category}</td>
              <td className="td">{ticket.description}</td>
              <td className="td">{ticket.assignedModuleId}</td>
              <td className="td">{translateMaterial(ticket.ticketSource)}</td> {/* Material übersetzt */}
              <td className="td">
                <Link to={`/edit/${ticket.id}`} className="button edit-button">
                  {isDozent ? 'Bearbeiten' : 'Ansicht'}
                </Link>
                {isDozent && (
                  <button onClick={() => handleDelete(ticket.id)} className="button delete-button" style={{ backgroundColor: '#ff0000', color: 'white' }}>Löschen</button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default TicketListPage;
