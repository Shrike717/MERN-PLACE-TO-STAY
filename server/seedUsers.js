import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import { faker } from '@faker-js/faker';
import moment from 'moment';
import User from './models/User.js';
import dotenv from 'dotenv';

dotenv.config();

// MongoDB Verbindung
mongoose.connect(process.env.MONGO_CONNECT, {
	useNewUrlParser: true,
	useUnifiedTopology: true,
});

// Generiere Dummy-Benutzerdatensätze
const generateUsers = async () => {
	try {
		// Lösche vorhandene Benutzerdatensätze
		await User.deleteMany();

		const users = [];

		// Erstelle 20 Dummy-Benutzer
		for (let i = 0; i < 20; i++) {
			const name = faker.person.fullName();
			// const email = faker.internet.email();
			const email = `${name.split(' ').join('.').toLowerCase()}@test.com`;
			const password = await bcrypt.hash(name + '123', 12);
			const photoUrl = '';
			const role = 'basic';
			const active = true;
			const createdAt = moment().toISOString();

			users.push({
				name,
				email,
				password,
				photoUrl,
				role,
				active,
				createdAt,
			});
		} // Füge die Benutzerdatensätze zur Datenbank hinzu

		await User.insertMany(users);

		console.log(
			'Dummy-Benutzerdatensätze wurden erfolgreich erstellt und zur Datenbank hinzugefügt.'
		);
	} catch (error) {
		console.error(
			'Fehler beim Erstellen der Dummy-Benutzerdatensätze:',
			error
		);
	} finally {
		mongoose.disconnect();
	}
};

// Führe die Funktion aus, um die Benutzerdatensätze zu generieren
generateUsers();
