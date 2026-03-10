const express = require('express');
const path = require('path');
const app = express();
const PORT = 3000;
const os = require('os');

app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// ADD THIS - Health check endpoint
app.get('/health', (req, res) => {
    res.json({ status: 'ok', uptime: process.uptime(), timestamp: new Date() });
});

app.get('/which-server', (req, res) => {
  res.json({
    message: "Request handled by:",
    instance: process.env.INSTANCE_ID || "Unknown Instance",
    hostname: os.hostname(),
    timestamp: new Date()
  });
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
