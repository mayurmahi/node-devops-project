const express = require('express');
const path = require('path');
const app = express();
const PORT = 3000;

// 'public' folder ko static banao (taaki css/js load ho sake)
app.use(express.static(path.join(__dirname, 'public')));

// Root route '/' par index.html bhejo
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});