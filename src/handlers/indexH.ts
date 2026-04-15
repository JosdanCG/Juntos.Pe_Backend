import { Request, Response } from "express";
import slug from 'slug'
import User from "../models/User";
import { checkPass, hashPass } from "../utils/auth";
import { validationResult } from "express-validator";
import { generateJWT } from "../utils/jwt";

export const createAcount = async (req: Request, res: Response) => {

    let errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;
    
    const userExists = await User.findOne({ email });
    if (userExists) {
        const error = new Error('El usuario con este email ya está registrado');
        return res.status(400).json({ error: error.message });
    }

    const handle = slug(req.body.handle, '')
    const handleExists = await User.findOne({ handle })
    if (handleExists) { 
        const error = new Error('Nombre de usuario no disponible')
        return res.status(409).json({error: error.message})
    }
    
    const user = new User(req.body);
    user.password = await hashPass(password);
    user.handle = handle

    await user.save();
    res.status(201).send('Registro creado correctamente');
}

export const login = async (req: Request, res: Response) => {
    let errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
        const error = new Error('El usuario no existe');
        return res.status(404).json({ error: error.message });
    }

    const isPasswordCorrect = await checkPass(password, user.password)
    if (!isPasswordCorrect) {
        const error = new Error('El password es incorrecto');
        return res.status(401).json({ error: error.message });
    }

    const token = generateJWT({ id: user._id })
    
    res.send(token)
}
export const getUser = async (req: Request, res: Response) => { 
    const bearer = req.headers.authorization

    if (!bearer) {
        const error = new Error('No se proporcionó un token de autenticación');
        return res.status(401).json({ error: error.message });
    }
    
}