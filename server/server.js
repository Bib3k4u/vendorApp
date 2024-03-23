const express = require('express');
const bodyParser = require('body-parser');
const multer = require('multer');
const cors = require('cors');
const { Sequelize, DataTypes } = require('sequelize');

// Sequelize setup
const sequelize = new Sequelize('vendor', 'root', 'root', {
  host: 'localhost',
  dialect: 'mysql'
});

// Model definition
const Pdf = sequelize.define('Pdf', {
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  data: {
    type: DataTypes.BLOB('long'),
    allowNull: false
  }
});

// Express setup
const app = express();
app.use(bodyParser.json());
app.use(cors());

// Multer setup
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// PDF upload endpoint
app.post('/pdf/upload', upload.single('pdf'), async (req, res) => {
  try {
    const { originalname, buffer } = req.file;
    const pdf = await Pdf.create({ name: originalname, data: buffer });
    res.status(201).json(pdf);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
});

// Get all PDF names
app.get('/pdf', async (req, res) => {
  try {
    const pdfList = await Pdf.findAll({ attributes: ['name'] });
    res.json(pdfList);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
});

// Get PDF file by name
app.get('/pdf/:name', async (req, res) => {
  const { name } = req.params;
  try {
    const pdf = await Pdf.findOne({ where: { name } });
    if (!pdf) {
      return res.status(404).json({ message: 'PDF not found' });
    }
    res.set('Content-Type', 'application/pdf');
    res.send(pdf.data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
});

// Sync database and start server
sequelize.sync()
  .then(() => {
    app.listen(5000, () => {
      console.log('Server is running on port 5000');
    });
  })
  .catch(err => console.error('Error syncing database:', err));
