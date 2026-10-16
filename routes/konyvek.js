import express from 'express';
import pool from '../db.js';

const router = express.Router();

router.get('/elerheto', async (req, res) => {
    const sql = 'SELECT konyvek.cim FROM konyvek LEFT JOIN kolcsonzesek ON konyvek.id = kolcsonzesek.konyvId AND kolcsonzesek.visszahozva = "false"';
    const [rows] = await pool.query(sql);
    res.json(rows);
});


export default router;