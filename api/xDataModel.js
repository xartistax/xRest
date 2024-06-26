const db = require('./database');

const findAll = (page = 1, limit = 10, callback) => {
    const offset = (page - 1) * limit;
    db.query('SELECT * FROM xTable ORDER BY crawl_date DESC LIMIT ?, ?', [offset, parseInt(limit)], (err, results) => {
        if (err) return callback(err);
        callback(null, results);
    });
};

const findById = (id, callback) => {
    db.query('SELECT * FROM xTable WHERE id = ?', [id], (err, results) => {
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


const groupByCategory = (callback) => {
    db.query('SELECT category, COUNT(*) AS categoryCount FROM xTable WHERE category != "NaN" GROUP BY category', (err, results) => {
        if (err) return callback(err);

        // Create an object to hold the count of each individual category
        let categoryCounts = {};

        // Process each result
        results.forEach(result => {
            // Split the category by comma and trim whitespace
            const categories = result.category.split(',').map(cat => cat.trim());

            // Increment the count for each category found
            categories.forEach(cat => {
                if (categoryCounts[cat]) {
                    categoryCounts[cat] += result.categoryCount;
                } else {
                    categoryCounts[cat] = result.categoryCount;
                }
            });
        });

        // Convert the aggregated counts back into the array format expected by the callback
        const aggregatedResults = Object.entries(categoryCounts).map(([category, count]) => ({
            category,
            categoryCount: count
        }));

        const validCategories = aggregatedResults.filter(cat => cat.name !== 'NaN');
        callback(null, validCategories);
    });
};


const groupByAngebot = (callback) => {
    db.query('SELECT services, COUNT(*) AS categoryCount FROM xTable GROUP BY services', (err, results) => {
        if (err) return callback(err);

        let serviceCounts = {};

        results.forEach(result => {
            // Splitting the 'services' field by commas and trim each service
            const services = result.services.split(',').map(service => service.trim());

            services.forEach(service => {
                // If the service already exists in our object, add the count, otherwise, initialize it
                if (serviceCounts[service]) {
                    serviceCounts[service] += result.categoryCount;
                } else {
                    serviceCounts[service] = result.categoryCount;
                }
            });
        });

        // Convert the serviceCounts object into an array of objects with 'service' and 'count'
        const aggregatedResults = Object.entries(serviceCounts).map(([service, count]) => ({
            service,
            count
        }));

        // Now we return the aggregated results instead of the raw query results 
        callback(null, aggregatedResults);
    });
};



const groupByLocation = (callback) => {
    // Corrected SQL query to fetch locations and count of records per location
    db.query('SELECT location, COUNT(*) AS locationCount FROM xTable  GROUP BY location', (err, results) => {
        if (err) return callback(err);

        // Since the query now correctly counts records per location, we can directly use the results
        callback(null, results);

    });
};


const filterByCategory = (category, location, limit = 20, page = 1, callback) => {
    let baseQuery = `FROM xTable WHERE category LIKE ?`;
    const queryParams = [`%${decodeURIComponent(category)}%`]; // Ensure category is decoded

    if (location) {
        baseQuery += ` AND Location LIKE ?`;
        queryParams.push(`%${decodeURIComponent(location)}%`);
    }

    const offset = (page - 1) * limit;
    const itemsQuery = `SELECT * ${baseQuery} ORDER BY crawl_date DESC LIMIT ? OFFSET ?`;
    queryParams.push(limit, offset);

    console.log(`Executing query: ${itemsQuery} with params: ${queryParams.join(', ')}`); // Debugging

    db.query(itemsQuery, queryParams, (err, items) => {
        if (err) {
            console.error(err);
            return callback(err);
        }

        const countQuery = `SELECT COUNT(*) AS total ${baseQuery}`;
        // Use queryParams without the last two elements (LIMIT and OFFSET)
        db.query(countQuery, queryParams.slice(0, -2), (err, result) => {
            if (err) {
                console.error(err);
                return callback(err);
            }
            callback(null, { items, total: result[0].total });
        });
    });
};



const filterByService = (service, location, limit = 20, page = 1, callback) => {
    let baseQuery = `FROM xTable WHERE services LIKE ?`;
    const queryParams = [`%${decodeURIComponent(service)}%`]; // Ensure category is decoded

    if (location) {
        baseQuery += ` AND Location LIKE ?`;
        queryParams.push(`%${decodeURIComponent(location)}%`);
    }

    const offset = (page - 1) * limit;
    const itemsQuery = `SELECT * ${baseQuery} ORDER BY crawl_date DESC LIMIT ? OFFSET ?`;
    queryParams.push(limit, offset);

    console.log(`Executing query: ${itemsQuery} with params: ${queryParams.join(', ')}`); // Debugging

    db.query(itemsQuery, queryParams, (err, items) => {
        if (err) {
            console.error(err);
            return callback(err);
        }

        const countQuery = `SELECT COUNT(*) AS total ${baseQuery}`;
        // Use queryParams without the last two elements (LIMIT and OFFSET)
        db.query(countQuery, queryParams.slice(0, -2), (err, result) => {
            if (err) {
                console.error(err);
                return callback(err);
            }
            callback(null, { items, total: result[0].total });
        });
    });
};









module.exports = { findAll, findById, create, update, deleteById, groupByCategory, groupByAngebot, groupByLocation, filterByCategory, filterByService };
