const express = require('express');
const bodyParser = require('body-parser');
const multer = require('multer');
const cors = require('cors');
const { Sequelize, DataTypes } = require('sequelize');

// Sequelize setup
const sequelize = new Sequelize('bw6tgzw9k3xnzfwkdotd', 'uvbjzeragsupdkmx', 'Pz9LreP7jGXfhk5MUMYA', {
  host: 'bw6tgzw9k3xnzfwkdotd-mysql.services.clever-cloud.com',
  dialect: 'mysql'
});

// Model definition
const Pdf = sequelize.define('Pdf', {
  shopName: {
    type: DataTypes.STRING,
    allowNull: false
  },
  vendorName: {
    type: DataTypes.STRING,
    allowNull: false
  },
  contactNo: {
    type: DataTypes.STRING,
    allowNull: false
  },
  category: {
    type: DataTypes.STRING,
    allowNull: false
  },
  city: {
    type: DataTypes.STRING, // Adding City field
    allowNull: false
  },
  locality: {
    type: DataTypes.STRING, // Adding Locality field
    allowNull: false
  },
  latitude: {
    type: DataTypes.FLOAT,
    allowNull: false
  },
  longitude: {
    type: DataTypes.FLOAT,
    allowNull: false
  },
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
    const { shopName, vendorName, contactNo, category, city, locality, latitude, longitude } = req.body;
    const { originalname, buffer } = req.file;

    const pdf = await Pdf.create({
      shopName,
      vendorName,
      contactNo,
      category,
      city,
      locality,
      latitude,
      longitude,
      name: originalname,
      data: buffer
    });

    res.status(201).json(pdf);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
});

// Get all PDF names
// Get all PDF data
app.get('/pdf', async (req, res) => {
  try {
    const pdfList = await Pdf.findAll();
    const pdfDataList = await Promise.all(pdfList.map(async pdf => {
      const { name, data, ...rest } = pdf.toJSON();
      return { name, data: data.toString('base64'), ...rest };
    }));
    res.json(pdfDataList);
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
