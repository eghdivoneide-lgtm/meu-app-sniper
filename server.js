const express = require('express');
const path = require('path');
const app = express();

// Serve static files from current directory
app.use(express.static(__dirname));

// Main route
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'yaaken-scanner.html'));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`YAAKEN Scanner running on port ${PORT}`);
});
