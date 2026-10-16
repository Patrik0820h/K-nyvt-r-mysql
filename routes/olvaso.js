import express from 'express';
import pool from '../db.js';

const router = express.Router();

router.get('/:id/kolcsonzesek', async (req, res) => {
    const id = Number(req.params.id);
    if (!Number.isInteger(id)) 
    {
        return res.status(400).json({ error: 'Az id egész szám kell legyen.' });
    }

    const sql = "SELECT * FROM olvasok WHERE id = ?";

    const [olvasok] = await pool.query(sql, [id]);
    if (olvasok.length === 0)
    {
        return res.status(404).send("Az olvasó nem található.");
    }

    const sql2 = 'SELECT konyvek.cim AS konyvCim FROM kolcsonzesek JOIN konyvek ON kolcsonzesek.konyvId = konyvek.id WHERE kolcsonzesek.olvasoId = ? AND kolcsonzesek.visszahozva = "false"';
    const [eredmeny] = await pool.query(sql2, [id]);
    res.json({
        olvaso: olvasok[0].nev,
        kolcsonzesek: eredmeny.map(k => k.konyvCim)
    });
    

})

export default router;