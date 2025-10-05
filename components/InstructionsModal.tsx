import React, { useState, useCallback } from 'react';
import type { Connection } from '../types';
import { ClipboardIcon } from './icons/ClipboardIcon';
import { XIcon } from './icons/XIcon';
import { InfoIcon } from './icons/InfoIcon';

interface InstructionsModalProps {
  connection: Connection;
  onClose: () => void;
}

const CodeBlock: React.FC<{ children: React.ReactNode; }> = ({ children }) => {
    const [copied, setCopied] = useState(false);

    const handleCopy = useCallback(() => {
        if (!children) return;
        const textToCopy = String(children);
        navigator.clipboard.writeText(textToCopy).then(() => {
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        });
    }, [children]);

    return (
        <div className="bg-gray-900 rounded-lg p-4 relative font-mono text-sm mt-2">
            <button
                onClick={handleCopy}
                className="absolute top-2 right-2 p-1.5 bg-gray-700 rounded-md hover:bg-gray-600 text-gray-300 transition-colors"
                title="Copy to clipboard"
            >
                {copied ? 'Copied!' : <ClipboardIcon />}
            </button>
            <pre className="whitespace-pre-wrap break-all text-cyan-300">
                <code>{children}</code>
            </pre>
        </div>
    );
};

const VerificationResult: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div className="mt-3 flex items-start gap-3 rounded-md bg-sky-900/50 p-3 text-sm text-sky-200 border border-sky-800">
      <div className="mt-0.5 flex-shrink-0">
          <InfoIcon />
      </div>
      <div>{children}</div>
  </div>
);


const InstructionStep: React.FC<{
  step: string;
  title: string;
  command?: string;
  explanation: React.ReactNode;
  verification?: React.ReactNode;
}> = ({ step, title, command, explanation, verification }) => (
  <div className="border-l-4 border-gray-700 pl-4 py-2">
    <h4 className="font-semibold text-lg text-gray-200">
      <span className="text-cyan-400 font-bold mr-2">{step}.</span>
      {title}
    </h4>
    <div className="text-gray-400 my-2 text-sm space-y-2">{explanation}</div>
    {command && <CodeBlock>{command}</CodeBlock>}
    {verification && <VerificationResult>{verification}</VerificationResult>}
  </div>
);


const InstructionsModal: React.FC<InstructionsModalProps> = ({ connection, onClose }) => {

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div className="bg-gray-800 rounded-xl shadow-2xl p-6 w-full max-w-3xl max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
        <div className="flex justify-between items-center mb-4 sticky top-0 bg-gray-800 py-2 -mt-2">
            <h2 className="text-2xl font-bold text-cyan-400">Setup: "{connection.name}"</h2>
            <button onClick={onClose} className="text-gray-500 hover:text-gray-300">
                <XIcon />
            </button>
        </div>
        
        <div className="space-y-8">
            <div>
                <h3 className="text-xl font-semibold mb-3 text-teal-300">On the Server Machine ({connection.serverIp})</h3>
                <p className="text-gray-400 mb-4 text-sm">Run these commands on the machine that will be <strong>sending</strong> the audio.</p>
                <div className="space-y-6">
                    <InstructionStep
                        step="1"
                        title="Find Your Default Firewall Zone (Optional)"
                        command="firewall-cmd --get-default-zone"
                        explanation={
                            <p>This command identifies your system's main firewall profile (zone). The next steps will use this command automatically, so you don't need to manually edit anything. This step is just for your information.</p>
                        }
                         verification={
                           <p><strong>Expected Result:</strong> The output will be a single word, which is the name of your default zone (e.g., `public`, `FedoraWorkstation`, `home`).</p>
                        }
                    />
                    <InstructionStep
                        step="2"
                        title="Open Firewall Port"
                        command="sudo firewall-cmd --zone=$(firewall-cmd --get-default-zone) --add-port=4713/tcp --permanent"
                        explanation={
                            <>
                              <p>This command opens the PulseAudio port (`4713`) in your system's default firewall zone. The `--permanent` flag ensures this rule persists after a reboot.</p>
                               <p className="mt-2 text-gray-500 text-xs">The `$(firewall-cmd --get-default-zone)` part automatically inserts your default zone name, so you can copy and paste the entire command without changes.</p>
                            </>
                        }
                    />
                    <InstructionStep
                        step="3"
                        title="Reload & Verify Firewall"
                        command="sudo firewall-cmd --reload && sudo firewall-cmd --zone=$(firewall-cmd --get-default-zone) --list-ports"
                        explanation={
                            <p>This reloads the firewall to apply your new rule, then immediately lists the ports for your default zone to confirm the change. This command is also ready to be copied and pasted directly.</p>
                        }
                        verification={
                           <p><strong>Expected Result:</strong> You must see `4713/tcp` in the output list. If not, something is unusual about your firewall setup, and you may need to investigate your active zones manually.</p>
                        }
                    />
                     <InstructionStep
                        step="4"
                        title="Enable Network Audio (Temporarily)"
                        command={`pactl load-module module-native-protocol-tcp auth-ip-acl=127.0.0.1;${connection.clientIp}`}
                        explanation={
                            <>
                                <p>This uses PulseAudio's command-line tool (<code>pactl</code>) to load the network streaming module for the current session. <strong>This does not modify any system files.</strong></p>
                                <ul className="list-disc list-inside mt-2 pl-2 text-gray-500">
                                    <li><code>load-module ...</code>: Loads the module that enables network streaming.</li>
                                    <li><code>auth-ip-acl=...</code>: A security measure that specifies which IPs can connect. We allow the server itself (<code>127.0.0.1</code>) and your specified client machine (<code>{connection.clientIp}</code>).</li>
                                </ul>
                                <p className="mt-2 text-amber-300/80 text-xs"><strong>Note:</strong> This setting is temporary. You will need to run this command again if you reboot the server.</p>
                            </>
                        }
                    />
                </div>
            </div>

            <div>
                <h3 className="text-xl font-semibold mb-3 text-teal-300">On the Client Machine ({connection.clientIp})</h3>
                <p className="text-gray-400 mb-4 text-sm">Run these commands on the machine that will be <strong>playing</strong> the audio (i.e., has speakers).</p>
                 <div className="space-y-6">
                    <InstructionStep
                        step="1"
                        title="Test Connection to Server"
                        command={`nc -zv ${connection.serverIp} 4713`}
                        explanation={
                             <p>Use the network utility <code>nc</code> (netcat) to check if the server's port <code>4713</code> is reachable from the client. This is the most important test to ensure your machines can communicate.</p>
                        }
                        verification={
                            <>
                                <p><strong>Expected Result:</strong> A "Connection to ... succeeded!" message.</p>
                                <p className="mt-2 font-semibold">Troubleshooting:</p>
                                <ul className="list-disc list-inside text-gray-400">
                                    <li>If it says <strong>"Connection refused,"</strong> the server's firewall is likely blocking you, or the PulseAudio module (Server Step 4) isn't loaded.</li>
                                    <li>If it <strong>hangs or times out,</strong> you may have a network issue (are they on the same WiFi?) or the Server IP address is incorrect.</li>
                                </ul>
                            </>
                        }
                    />
                    <InstructionStep
                        step="2"
                        title="Set the PULSE_SERVER Environment Variable"
                        command={`export PULSE_SERVER=tcp:${connection.serverIp}`}
                        explanation={
                            <>
                                <p>This command tells PulseAudio-aware applications on this client where to find the audio server. It redirects their audio output over the network to your server machine.</p>
                                <p className="mt-2 text-amber-300/80 text-xs"><strong>Note:</strong> This setting is temporary and only applies to the current terminal session. To make it permanent, add this line to your shell's startup file (e.g., <code>~/.bashrc</code> or <code>~/.zshrc</code>).</p>
                            </>
                        }
                    />
                    <InstructionStep
                        step="3"
                        title="Test Audio with an Application"
                        command={`mpv --ao=pulse "https://www.youtube.com/watch?v=dQw4w9WgXcQ"`}
                        explanation={
                            <>
                                <p>Launch a media player like <code>mpv</code> and explicitly tell it to use PulseAudio with <code>--ao=pulse</code>. The application will run on your client machine, but the audio should now be heard from your server machine's speakers.</p>
                                <p className="mt-2 text-gray-500 text-xs">Any application launched from this terminal will now send its audio to the server.</p>
                            </>
                        }
                    />
                </div>
            </div>
        </div>
      </div>
    </div>
  );
};

export default InstructionsModal;