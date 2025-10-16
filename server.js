const express = require('express');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Example route
app.get('/', (req, res) => {
    res.send('Portfolio server is running!');
});
s
// Start server
app.listen(PORT, () => {
    console.log(`Server is listening on port ${PORT}`);
});