import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: 'https://isef.palt.one/',
  headers: {
    'Authorization': '123', // Ersetzen Sie '123' durch Ihren tatsächlichen API-Schlüssel
    'Content-Type': 'application/json'
  }
});

export default axiosInstance;
