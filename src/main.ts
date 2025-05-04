import { startServer, setupGracefulShutdown } from './app';

// Setup proper application shutdown
setupGracefulShutdown();

// Start the server
startServer(); 