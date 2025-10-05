# PulseStream Connect

An interactive guide to help you create, manage, and configure PulseAudio network streams between machines. Generate the necessary server and client commands with ease.

## What It Does

PulseStream Connect provides a simple, interactive user interface to manage PulseAudio network streaming configurations between two machines on your local network. It's designed to abstract away the complexity of manual configuration by generating the exact shell commands you need to copy and paste into your terminals.

Stop searching through forums and documentation every time you want to route audio from one computer to another. With PulseStream Connect, you can save your configurations and get the setup commands in seconds.

## Features

- **Intuitive UI**: A clean, modern interface for managing your connections.
- **Full CRUD Support**: Create, read, update, and delete connection profiles with ease.
- **Persistent Storage**: Saves your connections in your browser's local storage so they're always there when you need them.
- **Step-by-Step Guidance**: Generates clear, copy-pasteable commands for both the server (audio source) and client (audio output) machines.
- **Detailed Explanations**: Understand *why* each command works, with in-app explanations for every step and parameter.
- **Clean & Responsive**: A modern, dark-themed interface that works great on any screen size.
- **Zero Backend**: Runs entirely in your browser. No data is sent to any server.

## Getting Started: Running Locally

To run this application on your own machine, you'll need to have [Node.js](https://nodejs.org/) installed (which includes `npm`).

1.  **Clone the repository** (if you haven't already):
    ```bash
    git clone https://github.com/swipswaps/PulseStream-Connect-v2.git
    cd PulseStream-Connect-v2
    ```

2.  **Install dependencies**:
    This command reads the `package.json` file and downloads the necessary libraries (like React) into a `node_modules` folder.
    ```bash
    npm install
    ```

3.  **Start the development server**:
    This command starts a local web server to host the application.
    ```bash
    npm run dev
    ```

4.  **Open the App**:
    Your terminal will display a local URL. Open this URL in your web browser. It will typically be:
    **`http://localhost:5173`**

## How It Works: A User Guide

### Terminology

- **Server**: The machine where the audio is **originating** (e.g., the one playing a game, video, or music).
- **Client**: The machine where you want the audio to be **played** (e.g., the one connected to your good speakers or headphones).

### Step-by-Step Instructions

1.  **Run and Open the App**: Follow the "Getting Started" instructions above to run the local server. Navigate to the provided `localhost` address in your browser.

2.  **Create a New Connection**:
    - Click the **"New Connection"** button.
    - A form will pop up. Fill in the details:
        - **Connection Name**: A memorable name for this setup (e.g., "Gaming PC to Living Room TV").
        - **Server IP Address**: The local IP address of the audio source machine.
        - **Client IP Address**: The local IP address of the audio playback machine.
    - Click **"Create Connection"**.

3.  **Manage Your Connection**:
    - Your new connection will appear in the list on the main screen.
    - Use the icons on the right to manage it:
        - **View (Eye Icon)**: Opens the step-by-step setup instructions.
        - **Edit (Pencil Icon)**: Allows you to change the name or IP addresses.
        - **Delete (Trash Icon)**: Removes the connection.

4.  **Execute the Commands**:
    - Click the **View icon**.
    - A modal will appear with two sets of commands.
    - **On the Server machine**, open a terminal and execute the commands under the "On the Server Machine" section, one by one. Read the explanations to understand what they do.
    - **On the Client machine**, open a terminal and execute the commands under the "On the Client Machine" section.

5.  **Enjoy Your Stream!**
    - After running the client commands, any PulseAudio-aware application you launch from that *same terminal* will now route its audio to the server machine for playback. The example command shows how to test this with `mpv`.

## Technical Details

- **Stack**: React, TypeScript, Tailwind CSS
- **Build Tool**: Vite
- **State Management**: React Hooks (`useState`)
- **Persistence**: Browser `localStorage` via a custom `useLocalStorage` hook.

This application is a static web app that serves as a frontend for generating shell commands. It helps users configure PulseAudio's `module-native-protocol-tcp` for network audio streaming without requiring them to remember the specific commands or firewall rules.

## Disclaimer

-   **Security**: This tool is intended for use on a **trusted local network only**. Exposing PulseAudio to the public internet is a significant security risk. The generated commands are configured to only allow access from the specific client IP you provide.
-   **Compatibility**: The generated server commands are tailored for Linux distributions that use `firewalld` (e.g., Fedora, CentOS, RHEL). For distributions using `ufw` (e.g., Ubuntu, Debian), you will need to adapt the firewall command (e.g., `sudo ufw allow 4713/tcp`). The app's instructions for `firewalld` guide you through finding and using your active firewall zone for best results.