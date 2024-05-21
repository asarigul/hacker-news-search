const express = require('express');
const path = require("node:path");
const axios = require('axios');

const app = express();

app.locals.dateFns = require('date-fns');

const dateFormat = 'LLL dd, yyyy';


app.get('/', (req, res) => {
    console.log(`request received for url  ${req.url}`);
    res.render('home', {
        title: 'HomePage'
    });
});

app.set('view engine', 'pug');
// app.set('views', path.join(__dirname, '..', 'views')); // 1 level up
app.set('views', path.join(__dirname, 'views'));

// add static file handling
app.use(express.static(path.join(__dirname, 'public')));

app.get('/search', async (req, res, next) => {
    const searchQuery = req.query.q;
    if (!searchQuery) {
        res.redirect(302, '/');
        return;
    }

    console.log(`search query: ${searchQuery}`);

    try {
        const results = await searchHN(searchQuery);
        res.render('search', {
            title: `Search results for: ${searchQuery}`,
            searchQuery,
            results,
            dateFormat,
        });
    } catch (err) {
        console.log(next);
        next(err); // deletage to error handler
    }
});

async function searchHN(query) {
    const response = await axios.get(
        `https://hn.algolia.com/api/v1/search?query=${query}&tags=story&hitsPerPage=10`
    );

    return response.data;
}

app.use(function (err, req, res, next) {
    console.error(err);
    res.set('Content-Type', 'text/html');
    res.render('error', {})
});

const port = process.env.PORT || 3000;

const server = app.listen(port, () => {
    console.log(`Server started on port: ${server.address().port}`);
});