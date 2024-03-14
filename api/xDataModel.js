const db = require('./database');

const findAll = (page = 1, limit = 10, callback) => {
    const offset = (page - 1) * limit;
    db.query('SELECT * FROM xTable ORDER BY crawl_date DESC LIMIT ?, ?', [offset, parseInt(limit)], (err, results) => {
        if (err) return callback(err);
        callback(null, results);
    });
};

const findById = (id, callback) => {
    db.query('SELECT * FROM xTable WHERE uuid = ?', [id], (err, results) => {
        if (err) return callback(err);
        // results is an array of rows. You should return the first one if it exists.
        callback(null, results[0]);
    });
};

const create = (xData, callback) => {
    db.query('INSERT INTO xTable SET ?', xData, (err, result) => {
        if (err) return callback(err);
        callback(null, result);
    });
};

const update = (id, xData, callback) => {
    db.query('UPDATE xTable SET ? WHERE id = ?', [xData, id], (err, result) => {
        if (err) return callback(err);
        callback(null, result);
    });
};

const deleteById = (id, callback) => {
    db.query('DELETE FROM xTable WHERE id = ?', id, (err, result) => {
        if (err) return callback(err);
        callback(null, result);
    });
};





module.exports = { findAll, findById, create, update, deleteById };
