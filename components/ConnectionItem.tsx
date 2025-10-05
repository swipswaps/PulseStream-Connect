
import React from 'react';
import type { Connection } from '../types';
import { EyeIcon } from './icons/EyeIcon';
import { TrashIcon } from './icons/TrashIcon';
import { PencilIcon } from './icons/PencilIcon';

interface ConnectionItemProps {
  connection: Connection;
  onDelete: (id: string) => void;
  onView: (connection: Connection) => void;
  onEdit: (connection: Connection) => void;
}

const ConnectionItem: React.FC<ConnectionItemProps> = ({ connection, onDelete, onView, onEdit }) => {
  return (
    <div className="bg-gray-800 rounded-lg p-4 flex items-center justify-between shadow-md hover:shadow-cyan-500/20 hover:border-cyan-500 border border-transparent transition-all duration-300">
      <div>
        <h3 className="text-lg font-bold text-cyan-300">{connection.name}</h3>
        <p className="text-sm text-gray-400">
          <span className="font-semibold">Server:</span> {connection.serverIp} → <span className="font-semibold">Client:</span> {connection.clientIp}
        </p>
      </div>
      <div className="flex items-center gap-3">
        <button
          onClick={() => onView(connection)}
          className="p-2 rounded-full bg-blue-500/20 hover:bg-blue-500/40 text-blue-300 transition-colors"
          aria-label="View Instructions"
        >
          <EyeIcon />
        </button>
        <button
          onClick={() => onEdit(connection)}
          className="p-2 rounded-full bg-yellow-500/20 hover:bg-yellow-500/40 text-yellow-300 transition-colors"
          aria-label="Edit Connection"
        >
          <PencilIcon />
        </button>
        <button
          onClick={() => onDelete(connection.id)}
          className="p-2 rounded-full bg-red-500/20 hover:bg-red-500/40 text-red-300 transition-colors"
          aria-label="Delete Connection"
        >
          <TrashIcon />
        </button>
      </div>
    </div>
  );
};

export default ConnectionItem;
