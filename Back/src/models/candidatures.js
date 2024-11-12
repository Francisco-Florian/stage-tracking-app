const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Candidatures = sequelize.define('candidatures', {
    entreprise: {
        type: DataTypes.STRING,
        allowNull: false,
    },

    poste: {
        type: DataTypes.STRING,
        allowNull: false,
    },

    email: {
        type: DataTypes.STRING,
        allowNull: true,
    },

    telephone: {
        type: DataTypes.INTEGER,
        allowNull: true,
    },

    status: {
        type: DataTypes.ENUM([
            'A envoyer',
            'En attente',
            'A suivre',
            'Acceptée',
            'Rejetée'
        ]),
        allowNull: false,
    },

    note: {
        type: DataTypes.STRING,
        allowNull: true,
    },

    file: {
        type: DataTypes.STRING,
        allowNull: true,
    }
})

module.exports = Candidatures;
