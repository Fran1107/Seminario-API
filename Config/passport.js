import dotenv from 'dotenv';
import passport from 'passport'
import { ClienteModel } from '../Model/cliente.js';
import bcrypt from 'bcrypt'
import { connection } from '../Database/postgres.js';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';

dotenv.config();

passport.use(new GoogleStrategy({
    clientID: process.env.CLIENT_ID, 
    clientSecret: process.env.CLIENT_SECRET,
    callbackURL: 'http://localhost:3000/user/google/callback'
}, async (accessToken, refreshToken, profile, done) => {
    try {
        // Buscar si el usuario ya existe en la base de datos
        let user = await ClienteModel.getByGoogleId({ cli_googleId: profile.id });

        // Si no existe, crearlo
        if (!user) {
            const randomCuil = Math.floor(Math.random() * 10000000); 
            const randomPassword = await bcrypt.hash(Math.random().toString(36).slice(-8), parseInt(process.env.SALT_ROUNDS));
            const newUser = await connection.query(
            `INSERT INTO clientes (cli_googleId, email, nombre, contrasena, cli_cuil, rol_id) VALUES ($1, $2, $3, $4, $5, 1) RETURNING *`,
            [profile.id, profile.emails[0].value, profile.displayName, randomPassword, randomCuil]
        );
            user = newUser.rows[0];
        }

        return done(null, user);

        } catch (err) {
            return done(err, false);
        }
    }
))

passport.serializeUser((user, done) => {
    done(null, user.cli_googleid)
})

passport.deserializeUser(async (cli_googleId, done) => {
    try {
        const user = await ClienteModel.getByGoogleId({ cli_googleId });
        done(null, user);
    } catch (error) {
        done(error, false)
    }
})