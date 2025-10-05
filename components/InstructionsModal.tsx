
import React, { useState, useCallback } from 'react';
import type { Connection } from '../types';
import { ClipboardIcon } from './icons/ClipboardIcon';
import { XIcon } from './icons/XIcon';

interface InstructionsModalProps {
  connection: Connection;
  onClose: () => void;
}

const CodeBlock: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => {
    const [copied, setCopied] = useState(false);

    const handleCopy = useCallback(() => {
        const textToCopy = Array.isArray(children) ? children.join('\n') : String(children);
        navigator.clipboard.writeText(textToCopy).then(() => {
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        });
    }, [children]);

    return (
        <div className="bg-gray-900 rounded-lg p-4 relative font-mono text-sm">
            <button 
                onClick={handleCopy}
                className="absolute top-2 right-2 p-1.5 bg-gray-700 rounded-md hover:bg-gray-600 text-gray-300"
            >
                {copied ? 'Copied!' : <ClipboardIcon />}
            </button>
            <pre className="whitespace-pre-wrap break-all text-cyan-300">
                <code>{children}</code>
            </pre>
        </div>
    );
};


const InstructionsModal: React.FC<InstructionsModalProps> = ({ connection, onClose }) => {
    
  const serverCommands = [
    '# 1. Open PulseAudio Port (4713/tcp) on the server.',
    '# This allows the client machine to connect to the PulseAudio daemon.',
    'sudo firewall-cmd --add-port=4713/tcp --permanent',
    '',
    '# 2. Reload the firewall to apply the new rule.',
    'sudo firewall-cmd --reload',
    '',
    '# 3. Verify the port is open.',
    '# You should see 4713/tcp in the output list.',
    'sudo firewall-cmd --list-ports',
    '',
    '# NOTE: You may also need to edit /etc/pulse/default.pa on the server to load the TCP module.',
    '# Add this line: load-module module-native-protocol-tcp auth-ip-acl=127.0.0.1;${connection.clientIp}'
  ].join('\n');

  const clientCommands = [
    `# 1. Test connection to the server's PulseAudio port.`,
    `# If this command says "succeeded!", you're ready for the next step.`,
    `nc -zv ${connection.serverIp} 4713`,
    '',
    `# 2. Set the PULSE_SERVER environment variable.`,
    `# This tells applications on this client machine to send their audio to the server.`,
    `export PULSE_SERVER=tcp:${connection.serverIp}`,
    '',
    `# 3. Test with an application, like mpv.`,
    `# The video will play locally, but the audio should come from the server's speakers.`,
    `mpv --vo=x11 --ao=pulse https://www.youtube.com/watch?v=dQw4w9WgXcQ`
  ].join('\n');

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div className="bg-gray-800 rounded-xl shadow-2xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
        <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold text-cyan-400">Setup Instructions for "{connection.name}"</h2>
            <button onClick={onClose} className="text-gray-500 hover:text-gray-300">
                <XIcon />
            </button>
        </div>
        
        <div className="space-y-6">
            <div>
                <h3 className="text-xl font-semibold mb-2 text-teal-300">On the Server Machine ({connection.serverIp})</h3>
                <p className="text-gray-400 mb-3 text-sm">Run these commands on the machine that will be sending the audio.</p>
                <CodeBlock title="Server Commands">{serverCommands}</CodeBlock>
            </div>

            <div>
                <h3 className="text-xl font-semibold mb-2 text-teal-300">On the Client Machine ({connection.clientIp})</h3>
                <p className="text-gray-400 mb-3 text-sm">Run these commands on the machine that will be playing the audio (i.e., has speakers).</p>
                 <CodeBlock title="Client Commands">{clientCommands}</CodeBlock>
            </div>
        </div>
      </div>
    </div>
  );
};

export default InstructionsModal;
