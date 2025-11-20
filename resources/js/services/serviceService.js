import api from './api'; 

export const getPublicServices = () => {
  return api.get('/services'); 
};