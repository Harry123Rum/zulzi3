import React from 'react';

export default function ServiceCard({ armada }) {
  return (
    <div className="border rounded-lg shadow-lg p-4 bg-white">
      <h4 className="text-xl font-bold text-gray-800">{armada.model}</h4>
      <p className="text-gray-600">{armada.jenis_kendaraan}</p>

      <div className="mt-4">
        <span className="text-lg font-bold text-blue-600">
          Rp {armada.harga_sewa_per_hari}
        </span>
        <span className="text-gray-500 text-sm"> / hari</span>
      </div>
    </div>
  );
}