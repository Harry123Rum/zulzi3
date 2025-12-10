import React from 'react';

export default function ReviewCard({ review }) {
  return (
    <div className="border p-4 bg-white rounded-lg shadow-lg">
      {review.pengguna ? (
        <div className="flex items-center mb-2">
          <h4 className="font-bold">{review.pengguna.nama}</h4>
        </div>
      ) : (
        <h4 className="font-bold">Pengguna Anonim</h4>
      )}

      <p className="text-gray-600 italic">"{review.komentar}"</p>
      <p className="text-yellow-500 mt-2">
        ★ {((review.rating_driver + review.rating_kendaraan + review.rating_pelayanan) / 3).toFixed(1)}
      </p>
    </div>
  );
}