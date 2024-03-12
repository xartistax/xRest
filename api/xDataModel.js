const db = require('./database');

const findAll = callback => {
    db.query('SELECT * FROM xTable', (err, results) => {
        if (err) return callback(err);
        callback(null, results);
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

module.exports = { findAll, create, update, deleteById };
