import axios from 'axios';

export const api = axios.create({
  baseURL: 'https://registry.npmjs.com/-/v1',
});
