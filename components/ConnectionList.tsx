
import React from 'react';
import type { Connection } from '../types';
import ConnectionItem from './ConnectionItem';

interface ConnectionListProps {
  connections: Connection[];
  onDelete: (id: string) => void;
  onView: (connection: Connection) => void;
  onEdit: (connection: Connection) => void;
}

const ConnectionList: React.FC<ConnectionListProps> = ({ connections, onDelete, onView, onEdit }) => {
  if (connections.length === 0) {
    return (
      <div className="text-center p-12 border-2 border-dashed border-gray-700 rounded-lg bg-gray-800/50">
        <h3 className="text-xl font-semibold text-gray-400">No connections yet!</h3>
        <p className="text-gray-500 mt-2">Click "New Connection" to get started.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {connections.map(connection => (
        <ConnectionItem
          key={connection.id}
          connection={connection}
          onDelete={onDelete}
          onView={onView}
          onEdit={onEdit}
        />
      ))}
    </div>
  );
};

export default ConnectionList;
