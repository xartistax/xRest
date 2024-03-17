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


const filterByCategoryAndServices = (category, services, location, callback) => {
    // Base query for both items and count
    let baseQuery = `FROM xTable WHERE category LIKE '%${category}%'`;

    if (services.length > 0) {
        const serviceConditions = services.map(service => `services LIKE '%${service}%'`).join(' AND ');
        baseQuery += ` AND (${serviceConditions})`;
    }

    if (location) {
        baseQuery += ` AND Location LIKE '%${location}%'`;
    }

    // Query to get the items
    const itemsQuery = `SELECT * ${baseQuery} ORDER BY Likes DESC;`;

    // Query to get the count of items
    const countQuery = `SELECT COUNT(*) AS itemCount ${baseQuery};`;

    // First, get the count of filtered items
    db.query(countQuery, (err, countResult) => {
        if (err) {
            console.error(err);
            return callback(err);
        }

        // Then, fetch the items if count > 0
        if (countResult[0].itemCount > 0) {
            db.query(itemsQuery, (err, items) => {
                if (err) {
                    console.error(err);
                    return callback(err);
                }

                // Return both items and their count
                callback(null, {items: items, count: countResult[0].itemCount});
            });
        } else {
            // No items found, return count as 0
            callback(null, {items: [], count: 0});
        }
    });
};





module.exports = { findAll, findById, create, update, deleteById, groupByCategory, groupByAngebot, groupByLocation, filterByCategoryAndServices };
