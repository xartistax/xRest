const db = require('./database'); // Adjust the path as necessary to point to your database.js file
const cors = require('cors');
const express = require('express');
const router = express.Router();
const { findAll, findById, create, update, deleteById, groupByCategory, groupByAngebot, groupByLocation, filterByCategoryAndServices } = require('./xDataModel');
const getTotalCount = callback => {
    db.query('SELECT COUNT(*) AS totalCount FROM xTable', (err, results) => {
        if (err) return callback(err);
        callback(null, results[0].totalCount);
    });
};




 
router.use(cors());



router.get('/', (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    getTotalCount((err, totalCount) => {
        if (err) return res.status(500).send(err);

        findAll(page, limit, (err, items) => {
            if (err) return res.status(500).send(err);
            res.status(200).json({
                data: items,
                meta: {
                    totalItems: totalCount,
                    currentPage: page,
                    totalPages: Math.ceil(totalCount / limit),
                    itemsPerPage: limit
                }
            });
        });
    });
});

router.post('/', (req, res) => {
    create(req.body, (err, result) => {
        if (err) return res.status(500).send(err);
        res.status(201).send(`Item added with ID: ${result.insertId}`);
    });
});

router.get('/groupbycategory', (req, res) => {
    // Assuming you don't need an ID to group by category.
    groupByCategory((err, items) => {
        if (err) return res.status(500).send(err);
        if (!items.length) return res.status(404).send('Items not found');
        res.status(200).json(items);
    });
});

router.get('/groupbyangebot', (req, res) => {
    // Assuming you don't need an ID to group by category.
    groupByAngebot((err, items) => {
        if (err) return res.status(500).send(err);
        if (!items.length) return res.status(404).send('Items not found');
        res.status(200).json(items);
    });
});


router.get('/groupbylocation', (req, res) => {
    // Assuming you don't need an ID to group by category.
    groupByLocation((err, items) => {
        if (err) return res.status(500).send(err);
        if (!items.length) return res.status(404).send('Items not found');
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




router.get('/filter/:category', (req, res) => {
    
    const { category } = req.params;
    let { services, location } = req.query;
    
    // Convert services string to array by splitting it using comma as delimiter
    services = services ? services.split(',') : [];

    filterByCategoryAndServices(category, services, location, (err, items) => {
        if (err) return res.status(500).send(err);
        if (!items || items.length === 0) return res.status(404).send('Items not found');
        res.status(200).json(items);
    });
});

module.exports = router;
