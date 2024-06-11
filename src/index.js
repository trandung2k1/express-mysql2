require('dotenv').config();
const db = require('./config/db');
const express = require('express');
const port = process.env.PORT || 3000;
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.disable('x-powered-by');
app.get('/', async (req, res) => {
    try {
        //LIMIT 1
        const [rows, fields] = await db.query('SELECT * FROM users');
        return res.status(200).json(rows);
        // const sql = 'SELECT * FROM `users` WHERE `name` = ? AND `id` > ?';
        // const values = ['Dung', 1];
        // const [rows, fields] = await db.query(
        //     {
        //         sql,
        //     },
        //     values,
        // );
        // console.log(fields);
        // return res.status(200).json(rows);
    } catch (error) {
        return res.status(500).json(error);
    }
});

app.get('/transaction', async (req, res) => {
    let connection;
    try {
        connection = await db.getConnection();
        await connection.beginTransaction();
        const [rows] = await connection.query(
            'INSERT INTO `users`(`id`, `name`) VALUES (1, "Long")',
        );
        const [result] = await connection.query('DELETE FROM `users` WHERE `name` = "Lan"');
        if (result.affectedRows === 0) {
            throw new Error('User not found');
        }
        await connection.commit();
        return res
            .status(200)
            .json({ insertedLength: rows.affectedRows, deletedLength: result.affectedRows });
    } catch (error) {
        await connection.rollback();
        return res.status(500).json({
            message: error.message,
        });
    }
});
app.listen(port, () => {
    console.log(`Server listening on http://localhost:${port}`);
});
