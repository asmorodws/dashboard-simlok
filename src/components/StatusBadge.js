// StatusBadge.js
import React from 'react';

// Komponen untuk badge status
const StatusBadge = ({ status }) => {
  const getStatusBadgeClass = (status) => {
    switch (status) {
      case 1: return 'bg-green-100 text-green-800';
      case 2: return 'bg-red-100 text-red-800';
      case 3: return 'bg-red-100 text-red-800';

      case 0: return 'bg-yellow-100 text-yellow-800';
      case 'Disetujui': return 'bg-green-100 text-green-800';
      case 'Ditolak': return 'bg-red-100 text-red-800';
      case 'Menunggu': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 0:
        return "Pending";
      case 1:
        return "Approved";
      case 2:
        return "Rejected";
      case 3:
        return "Expired";
      default:
        return status;
    }
  };

  return (
    <span className={`ml-2 px-2 py-1 rounded-full text-xs font-medium ${getStatusBadgeClass(status)}`}>
      {getStatusText(status)}
    </span>
  );
};

export default StatusBadge;
