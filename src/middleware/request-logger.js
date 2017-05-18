const fs = require('fs');
const moment = require('moment');

module.exports = function(req, res, next) {
    const log = `${moment().unix()} ${req.method}${' '.repeat(7 - req.method.length)}${req.url}\n`;
    fs.appendFile('logs.txt', log, (err) => {
        if (err) throw err;
    });
    next();
};
