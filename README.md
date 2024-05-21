https://betterstack.com/community/guides/scaling-nodejs/build-nodejs-application-express-pug/

- express for server
  - route mapping
  - global error handling
- pug for templates
- pm2 for hot reload support in development
- axiom for rest calls
- date-fns for date formatting


0. create project folder
	mkdir hacker-news 

1. init project (adds package.json)
	npm init -y

2. install express
	npm install express

3. create server.js

4. test
   node server.js
   curl http://localhost:3000 

5. enable hot reloads using pm2
npm install pm2 --save-dev
    
6. update scripts in package.json
   "dev": "npx pm2-dev server.js",
   "start": "npx pm2 start server.js"

7. test
   npm run dev

8. add pug template engine
   npm install pug

   app.set('view engine', 'pug');
   app.set('views', path.join(__dirname, 'views'));

9. render templates

    res.render('template', {
        title: 'page title', 
        ...
    });

10. add static files & handling & src
    wget https://i.imgur.com/qUbNHtf.png -O public/images/hn.png

    app.use(express.static(path.join(__dirname, 'public'))); // server.js
    img(src="/images/hn.png" width="180" height="180") // pug template

11. add search endpoint
    app.get('/search', (req, res) => {
        const searchQuery = req.query.q;
        if (!searchQuery) {
            res.redirect(302, '/');
            return;
        }

        console.log(`search query: ${searchQuery}`);
        res.status(200).end();
    });
    
12. install axios to make api calls
    npm install axios

13. add async search function
    
    async function searchHN(query) {
        const response = await axios.get(
        `https://hn.algolia.com/api/v1/search?query=${query}&tags=story&hitsPerPage=90`
        );
    
        return response.data;
    }

14. add search.pug template, render it feeding search results

    const results = await searchHN(searchQuery);
    res.render('search', {
        title: `Search results for: ${searchQuery}`,
        searchQuery,
        results
    });

15. format dates
    npm install date-fns 
    app.locals.dateFns = require('date-fns'); 

16. apply a global error handler 
    works only for sync route handlers. won't work for async functions.
    to handle async errors, wrap the contents of the async function in a try...catch block and call next()

    app.use(function (err, req, res, next) {
        console.error(err);
        res.set('Content-Type', 'text/html');
        res.status(500).send('<h1>Internal Server Error</h1>');
    });

    // just before the server, or it wont work

17. run in prod mode:
    npm start (PM2 demon starts)
    pm2 kill // kills all apps and pm2 daemon