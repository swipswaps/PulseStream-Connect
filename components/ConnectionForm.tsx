
import React, { useState, useEffect } from 'react';
import type { Connection } from '../types';
import { XIcon } from './icons/XIcon';

interface ConnectionFormProps {
  onAdd: (connection: Omit<Connection, 'id'>) => void;
  onUpdate: (connection: Connection) => void;
  onClose: () => void;
  connectionToEdit?: Connection | null;
}

const ConnectionForm: React.FC<ConnectionFormProps> = ({ onAdd, onUpdate, onClose, connectionToEdit }) => {
  const [name, setName] = useState('');
  const [serverIp, setServerIp] = useState('');
  const [clientIp, setClientIp] = useState('');
  const [error, setError] = useState('');

  const isEditing = !!connectionToEdit;

  useEffect(() => {
    if (isEditing) {
      setName(connectionToEdit.name);
      setServerIp(connectionToEdit.serverIp);
      setClientIp(connectionToEdit.clientIp);
    }
  }, [connectionToEdit, isEditing]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !serverIp.trim() || !clientIp.trim()) {
      setError('All fields are required.');
      return;
    }
    // Basic IP regex for validation
    const ipRegex = /^(?:[0-9]{1,3}\.){3}[0-9]{1,3}$/;
    if (!ipRegex.test(serverIp) || !ipRegex.test(clientIp)) {
        setError('Please enter valid IP addresses.');
        return;
    }

    if (isEditing) {
      onUpdate({ id: connectionToEdit.id, name, serverIp, clientIp });
    } else {
      onAdd({ name, serverIp, clientIp });
    }
    setError('');
  };

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div className="bg-gray-800 rounded-xl shadow-2xl p-6 w-full max-w-md relative" onClick={(e) => e.stopPropagation()}>
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-500 hover:text-gray-300">
          <XIcon />
        </button>
        <h2 className="text-2xl font-bold mb-4 text-cyan-400">{isEditing ? 'Edit Connection' : 'New Connection'}</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-300">Connection Name</label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g., Office PC to Living Room"
              className="mt-1 block w-full bg-gray-700 border-gray-600 rounded-md shadow-sm focus:ring-cyan-500 focus:border-cyan-500 sm:text-sm p-2"
            />
          </div>
          <div>
            <label htmlFor="serverIp" className="block text-sm font-medium text-gray-300">Server IP Address (Machine with Audio Source)</label>
            <input
              type="text"
              id="serverIp"
              value={serverIp}
              onChange={(e) => setServerIp(e.target.value)}
              placeholder="192.168.1.100"
              className="mt-1 block w-full bg-gray-700 border-gray-600 rounded-md shadow-sm focus:ring-cyan-500 focus:border-cyan-500 sm:text-sm p-2"
            />
          </div>
          <div>
            <label htmlFor="clientIp" className="block text-sm font-medium text-gray-300">Client IP Address (Machine with Speakers)</label>
            <input
              type="text"
              id="clientIp"
              value={clientIp}
              onChange={(e) => setClientIp(e.target.value)}
              placeholder="192.168.1.150"
              className="mt-1 block w-full bg-gray-700 border-gray-600 rounded-md shadow-sm focus:ring-cyan-500 focus:border-cyan-500 sm:text-sm p-2"
            />
          </div>
          {error && <p className="text-red-400 text-sm">{error}</p>}
          <div className="pt-2">
            <button
              type="submit"
              className="w-full bg-cyan-500 hover:bg-cyan-600 text-white font-bold py-2 px-4 rounded-lg transition-colors duration-300"
            >
              {isEditing ? 'Update Connection' : 'Create Connection'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ConnectionForm;
