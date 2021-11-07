import {Express} from 'express';

export const configureGetTransactions = (app: Express) =>
    app.get('/transactions', (req, res) => {

    });