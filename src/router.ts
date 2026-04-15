import { Router } from "express";
import { createAcount, getUser, login } from "./handlers/indexH";
import { body } from "express-validator";
import { get } from "mongoose";

const router = Router();

router.post('/auth/register',
    body('handle')
        .notEmpty()
        .withMessage('El handle no puede ir vacio'),
    body('name')
        .notEmpty()
        .withMessage('El nombre no puede ir vacio'),
    body('email')
        .isEmail()
        .withMessage('El email no es valido'),
    body('password')
        .isLength({ min: 6 })
        .withMessage('El password es muy corto'),
    createAcount);

router.post('/auth/login',
    body('email')
        .isEmail()
        .withMessage('El email no es valido2'),
    body('password')
        .notEmpty()
        .withMessage('El password es obligatorio2'),
    login
)

router.get('/user', getUser)

export default router;