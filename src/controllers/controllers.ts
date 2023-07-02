import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import knex from '../connection';
import jwt, { Secret } from 'jsonwebtoken';

const secretjwt:Secret = "defaultPassword"

type responsePromise = Promise<Response<any, Record<string, any>>>;

const registerUser = async (req: Request, res: Response): responsePromise => {
    try {
        const { nome, email, senha }: { nome: string, email: string, senha: string } = req.body
        const senhaHash: string = await bcrypt.hash(senha.toString(), 10);
        await knex('users').insert({ nome, email, senha: senhaHash });
        return res.status(201).json({message: "user registered sucessfully."});
    } catch (error: any) {
        return res.status(500).json({ message: "intern server error" });
    }
};

const login = async (req: Request, res: Response): responsePromise => {

    const {email, password}:{email: string, password:string} = req.body

    try{
        const user = await knex('users').where({ email: email})
        const token = jwt.sign({user: user[0].id}, secretjwt,  {expiresIn: "6h"})
        const {password: _, ...loggedUser}= user[0]

        return res.status(200).json({
            user: loggedUser,
            token
        })

    }catch(err:any){
        return res.status(500).json({message: `erro interno do servidor ${err.message}`})
    }
}

export {
    registerUser,
    login
}