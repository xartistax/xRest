const express = require('express');
const router = express.Router();
const { findAll, findById, create, update, deleteById } = require('./xDataModel');

router.get('/', (req, res) => {
    findAll((err, items) => {
        if (err) return res.status(500).send(err);
        res.status(200).json(items);
    });
});



router.get('/:id', (req, res) => {
    const { id } = req.params;
    findById(id, (err, item) => {
        if (err) return res.status(500).send(err);
        if (!item) return res.status(404).send('Item not found');
        res.status(200).json(item);
    });
});




router.post('/', (req, res) => {
    create(req.body, (err, result) => {
        if (err) return res.status(500).send(err);
        res.status(201).send(`Item added with ID: ${result.insertId}`);
    });
});

router.put('/:id', (req, res) => {
    update(req.params.id, req.body, (err, result) => {
        if (err) return res.status(500).send(err);
        res.send('Item updated successfully.');
    });
});

router.delete('/:id', (req, res) => {
    deleteById(req.params.id, (err) => {
        if (err) return res.status(500).send(err);
        res.status(204).send();
    });
});

module.exports = router;
