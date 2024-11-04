const express = require('express');
const errorHandler = require('./middleware/errorHandler');
const sequelize = require('./config/database');
const cors = require('cors');
const app = express();
const candidaturesRoutes = require('./routes/candidaturesRoutes');
const port = process.env.PORT || 3000;
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/candidatures', candidaturesRoutes);

app.use(errorHandler);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});


sequelize.sync({ alter: true })
    .then(() => console.log('Tables synchronisées avec succès'))
    .catch(err => console.error('Erreur de synchronisation des tables :', err));

      
