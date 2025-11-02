const app = require('./app');
const appConfig = require('./config/app');
const path = require('path');
const express = require('express');

const PORT = appConfig.port;

// serve uploaded avatar files
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.listen(PORT, () => {
  console.log(`
╔═══════════════════════════════════════════╗
║                                           ║
║   Swahara Agreement Management System     ║
║                                           ║
║   Server running on port ${PORT}            ║
║   Environment: ${appConfig.env.padEnd(15)} ║
║                                           ║
║   http://localhost:${PORT}                   ║
║                                           ║
╚═══════════════════════════════════════════╝
  `);
});
