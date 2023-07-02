import { Request, Response, NextFunction } from 'express';
import { ObjectSchema } from 'joi';
import knex from '../connection'
import bcrypt from 'bcrypt';

type responsePromise = Promise<Response<any, Record<string, any>>>;

const bodyFieldRequestValidator = (joiSchema: ObjectSchema) => async (req: Request, res: Response, next: NextFunction) => {
    try {
        await joiSchema.validateAsync(req.body);
        next();
    } catch (error: any) {
        return res.status(500).json(error.message);
    }
};

const loginValidator = (joiSchema: ObjectSchema) => async (req: Request, res: Response, next: NextFunction) => {
        const {email, password}: {email:string, password:string} = req.body
    try {
        await joiSchema.validateAsync(req.body);

        const user = await knex('users').where({email: email})

        const passwordVerify = await bcrypt.compare(password, user[0].password);
    
        if(!passwordVerify){
            return res.status(401).json({mensagem: "senha incorreta."})
        }
        next();
    } catch (error:any) {
        return res.status(500).json(error.message);
    }
};

const emailExists = (waitedValue: boolean) => async (req: Request, res: Response, next: NextFunction) => {
    const { email }: { email: string } = req.body
    try {
        const isEmailExist: boolean = !!await knex('usuarios').select('*').where({ email: email }).first();
        if (isEmailExist === waitedValue) {
            next();
        } else {
            if (isEmailExist) {
                return res.status(500).json({ message: "email already registered." });
            };
            if (!isEmailExist) {
                return res.status(500).json({ message: "email already registered." });
            }
        }
    } catch (error: any) {
        return res.status(500).json({ mensagem: "intern server error" });
    }
};

export {
    bodyFieldRequestValidator,
    loginValidator,
    emailExists
}