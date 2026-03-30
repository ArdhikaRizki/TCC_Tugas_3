const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Note = sequelize.define(
  'Note',
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false,
    },
    judul: {
      type: DataTypes.STRING(150),
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    },
    isi: {
      type: DataTypes.TEXT,
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    },
    tanggal_dibuat: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    tableName: 'notes',
    timestamps: false,
  }
);

module.exports = Note;