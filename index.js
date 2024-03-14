
const app = require('./api/app'); // Make sure this correctly points to your app.js file
const PORT = process.env.PORT || 3002;





app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
});
