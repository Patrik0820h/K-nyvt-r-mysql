import express from 'express';
import pool from '../db.js';

const router = express.Router();
    
router.get('/', async (req, res) => {
    let sql = 'SELECT kolcsonzesek.*, konyvek.cim AS konyvCim, olvasok.nev AS olvasoNev FROM kolcsonzesek JOIN konyvek ON kolcsonzesek.konyvId = konyvek.id JOIN olvasok ON kolcsonzesek.olvasoId = olvasok.id';

    const aktiv = req.query.aktiv;
    if (aktiv == 'true') 
    {
        sql += 'WHERE kolcsonzesek.visszahozva = "false"';
    } 
    else if (aktiv == 'false') 
    {
        sql += 'WHERE kolcsonzesek.visszahozva = "true"';
    }

    let [rows] = await pool.query(sql);
    res.json(rows);
})

router.post('/', async (req, res) => {
    const konyvId = Number(req.query.konyvId);
    const olvasoId = Number(req.query.olvasoId);
    if (!Number.isInteger(konyvId) || !Number.isInteger(olvasoId)) 
    {
        return res.status(400).json({ error: 'A konyvId és az olvasoId egész szám kell legyen.' });
    }

    let checkkonyv = 'SELECT id FROM konyvek WHERE id = ?';
    let [konyvrows] = await pool.query(checkkonyv, [konyvId]);
    if (konyvrows.length == 0) 
    {
        return res.status(404).json({ error: 'A könyv nem található.' });
    }

    let checkolvaso = 'SELECT id FROM olvasok WHERE id = ?';
    let [olvasorows] = await pool.query(checkolvaso, [olvasoId]);
    if (olvasorows.length == 0) 
    {
        return res.status(404).json({ error: 'A olvaso nem található.' });
    }

    let checkkolcsonzes = 'SELECT id FROM kolcsonzesek WHERE konyvId = ? AND visszahozva = "false"';
    let [kolcsonzesrows] = await pool.query(checkkolcsonzes, [konyvId]);
    if (kolcsonzesrows.length > 0) 
    {
        return res.status(409).json({ error: 'A könyv már ki van kölcsönözve.' });
    }

    let insert = 'INSERT INTO kolcsonzesek (konyvId, olvasoId, datum, visszahozva) VALUES (?, ?, CURRENT_DATE(), "false")';
    await pool.query(insert, [konyvId, olvasoId]);
    res.status(201).json({ message: 'Kölcsönzés sikeresen létrehozva.' });

})

router.patch('/:id/visszahoz', async (req, res) => {
    const id = Number(req.params.id);
    if (!Number.isInteger(id)) 
    {
        return res.status(400).json({ error: 'Az id egész szám kell legyen.' });
    }

    let checkkolcsonzes = 'SELECT id FROM kolcsonzesek WHERE id = ? AND visszahozva = "false"';
    let [kolcsonzesrows] = await pool.query(checkkolcsonzes, [id]);
    if (kolcsonzesrows.length == 0) 
    {
        return res.status(404).json({ error: 'A kölcsönzés nem található vagy már visszahozva van.' });
    }

    let update = 'UPDATE kolcsonzesek SET visszahozva = "true" WHERE id = ?';
    await pool.query(update, [id]);
    res.json({ message: 'Kölcsönzés sikeresen visszahozva.' });

})

export default router;
