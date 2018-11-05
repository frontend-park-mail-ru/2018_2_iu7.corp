const express = require('express');
const morgan = require('morgan');
const path = require('path');
const fallback = require('express-history-api-fallback');
const app = express();

const port = process.env.PORT || 8000;
const root = path.resolve(__dirname, '..', 'dist');

app.use(morgan('dev'));
app.use(express.static(root));
app.use(fallback('index.html', {root}));

app.listen(port, function () {
	console.log(`Server listening port ${port}`);
});
