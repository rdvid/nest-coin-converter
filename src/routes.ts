import express, { Router } from 'express';
import { registerUser, login } from './controllers/controllers';
import { emailExists, bodyFieldRequestValidator, loginValidator } from './middleware/validations'
import { registerSchema, loginSchema } from './schemas/user'

const routes: Router = express.Router();

routes.post('/register', bodyFieldRequestValidator(registerSchema), emailExists(false), registerUser)
routes.post('/login', loginValidator(loginSchema), emailExists(true), login)

export default routes;