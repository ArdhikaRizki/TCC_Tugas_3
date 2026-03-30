require('dotenv').config();
const path = require('path');
const express = require('express');
const cors = require('cors');
const sequelize = require('./config/database');
const noteRoutes = require('./routes/noteRoutes');

const app = express();
const PORT = Number(process.env.PORT) || 3000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static(path.join(__dirname, 'views')));
// prefix disini masseh 
app.use('/api/notes', noteRoutes);

app.get('/health', (_req, res) => {
	return res.status(200).json({
		status: 'ok',
		message: 'Server aktif',
	});
});

app.get('/', (_req, res) => {
	return res.sendFile(path.join(__dirname, 'views', 'index.html'));
});

const startServer = async () => {
	try {
		await sequelize.authenticate();
		await sequelize.sync();

		app.listen(PORT, () => {
			console.log(`Server running on http://localhost:${PORT}`);
		});
	} catch (error) {
		console.error('Gagal konek/sinkron database:', error.message);
		process.exit(1);
	}
};

startServer();
