
import React, { useState } from 'react';
import { useLocalStorage } from './hooks/useLocalStorage';
import type { Connection } from './types';
import Header from './components/Header';
import ConnectionList from './components/ConnectionList';
import ConnectionForm from './components/ConnectionForm';
import InstructionsModal from './components/InstructionsModal';
import { PlusIcon } from './components/icons/PlusIcon';

const App: React.FC = () => {
  const [connections, setConnections] = useLocalStorage<Connection[]>('pulse-connections', []);
  const [isFormOpen, setIsFormOpen] = useState<boolean>(false);
  const [editingConnection, setEditingConnection] = useState<Connection | null>(null);
  const [selectedConnection, setSelectedConnection] = useState<Connection | null>(null);

  const addConnection = (connection: Omit<Connection, 'id'>) => {
    const newConnection: Connection = { ...connection, id: crypto.randomUUID() };
    setConnections([...connections, newConnection]);
    setIsFormOpen(false);
  };

  const updateConnection = (updatedConnection: Connection) => {
    setConnections(connections.map(c => c.id === updatedConnection.id ? updatedConnection : c));
    setEditingConnection(null);
    setIsFormOpen(false);
  };

  const deleteConnection = (id: string) => {
    setConnections(connections.filter(c => c.id !== id));
  };
  
  const handleEdit = (connection: Connection) => {
    setEditingConnection(connection);
    setIsFormOpen(true);
  };

  const handleCloseForm = () => {
    setIsFormOpen(false);
    setEditingConnection(null);
  };

  const openInstructions = (connection: Connection) => {
    setSelectedConnection(connection);
  };

  const closeInstructions = () => {
    setSelectedConnection(null);
  };

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 font-sans">
      <Header />
      <main className="container mx-auto p-4 md:p-8 max-w-4xl">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-cyan-400">Your Connections</h2>
          <button
            onClick={() => setIsFormOpen(true)}
            className="flex items-center gap-2 bg-cyan-500 hover:bg-cyan-600 text-white font-bold py-2 px-4 rounded-lg transition-colors duration-300 shadow-lg shadow-cyan-500/20"
          >
            <PlusIcon />
            New Connection
          </button>
        </div>
        
        <ConnectionList
          connections={connections}
          onDelete={deleteConnection}
          onView={openInstructions}
          onEdit={handleEdit}
        />

        {isFormOpen && (
          <ConnectionForm
            onAdd={addConnection}
            onUpdate={updateConnection}
            connectionToEdit={editingConnection}
            onClose={handleCloseForm}
          />
        )}

        {selectedConnection && (
          <InstructionsModal
            connection={selectedConnection}
            onClose={closeInstructions}
          />
        )}
      </main>
      <footer className="text-center p-4 text-gray-500 text-sm mt-8">
        <p>PulseStream Connect | Abstracting away complexities, one stream at a time.</p>
      </footer>
    </div>
  );
};

export default App;
