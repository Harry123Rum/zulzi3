import api from './api'; 

// Mengambil ulasan publik untuk landing page
export const getPublicReviews = () => {
  return api.get('/reviews/public'); 
};

// Mengambil data target pesanan untuk halaman review
export const getReviewTarget = (idPemesanan) => {
  return api.get(`/reviews/target/${idPemesanan}`);
};

// Mengirim ulasan baru
export const submitReview = (data) => {
  return api.post('/reviews', data);
};