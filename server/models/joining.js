// models/joining.js

module.exports = (sequelize, DataTypes) => {
    const Joining = sequelize.define('Joining', {
      shopName: DataTypes.STRING,
      category: DataTypes.STRING,
      vendorName: DataTypes.STRING,
      contactNo: DataTypes.STRING,
      city: DataTypes.STRING,
      locality: DataTypes.STRING,
      latitude: DataTypes.FLOAT,
      longitude: DataTypes.FLOAT,
      fileData: DataTypes.BLOB, // If you're storing file data as blob
    });
  
    return Joining;
  };
  