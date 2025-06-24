#!/usr/bin/env node

import { spawn } from 'child_process';
import { setTimeout } from 'timers/promises';
import { fileURLToPath } from 'url';

const MAX_WAIT_TIME = 120000; // 2 minutes
const CHECK_INTERVAL = 1000; // 1 second

async function checkServer(url) {
  try {
    const response = await fetch(url);
    return response.ok;
  } catch {
    return false;
  }
}

async function startServerAndWait() {
  console.log('Starting preview server...');
  
  const server = spawn('npm', ['run', 'preview', '--', '--host', '127.0.0.1', '--port', '4321'], {
    stdio: ['ignore', 'pipe', 'pipe'],
    detached: false
  });

  server.stdout.on('data', (data) => {
    console.log(`Server: ${data.toString().trim()}`);
  });

  server.stderr.on('data', (data) => {
    console.error(`Server Error: ${data.toString().trim()}`);
  });

  const url = 'http://127.0.0.1:4321';
  const startTime = Date.now();

  console.log(`Waiting for server to be ready at ${url}...`);

  while (Date.now() - startTime < MAX_WAIT_TIME) {
    if (await checkServer(url)) {
      console.log('✅ Server is ready!');
      return server;
    }
    
    console.log('⏳ Waiting for server...');
    await setTimeout(CHECK_INTERVAL);
  }

  server.kill();
  throw new Error('❌ Server failed to start within timeout period');
}

// If script is run directly
if (process.argv[1] === fileURLToPath(import.meta.url)) {
  try {
    const server = await startServerAndWait();
    console.log('Server started successfully. Press Ctrl+C to stop.');
    
    process.on('SIGINT', () => {
      console.log('\nStopping server...');
      server.kill();
      process.exit(0);
    });
    
    // Keep the script running
    await new Promise(() => {});
  } catch (error) {
    console.error(error.message);
    process.exit(1);
  }
}