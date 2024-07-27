// src/services/ticketService.js
import axios from 'axios';

const API_URL = 'http://localhost:5000/api/tickets';

export const getTickets = async () => {
  return axios.get(API_URL).then(response => response.data);
};

export const createTicket = async (ticket) => {
  return axios.post(API_URL, ticket).then(response => response.data);
};

export const getTicketById = async (id) => {
  return axios.get(`${API_URL}/${id}`).then(response => response.data);
};

export const updateTicket = async (id, ticket) => {
  return axios.put(`${API_URL}/${id}`, ticket).then(response => response.data);
};
