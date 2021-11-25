const express = require('express');

const router = require('./src/route');
const cors = require('cors');
const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(cors());
app.use('/api/v1', router);
app.use('/uploads', express.static('uploads'));
app.listen(PORT, () => console.log(`Server is running on PORT ${PORT}`));
