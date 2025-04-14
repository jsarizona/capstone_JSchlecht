// api.ts
import axios from 'axios';

const BASE_URL = 'http://192.168.6.181:5000';

const CustomServer = axios.create({
  baseURL: BASE_URL,
  timeout: 10000, // optional
  headers: {
    'Content-Type': 'application/json',
  },
});

export default CustomServer;
