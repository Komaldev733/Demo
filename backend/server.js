const dotenv = require('dotenv');
dotenv.config({ path: './.env' });

const express = require('express');
const cors = require('cors');
const connectDB = require('./db');
const fileRoutes = require('./routes/fileRoute');

connectDB();

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api/files', fileRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
