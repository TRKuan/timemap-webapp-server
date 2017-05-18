//老實說我也不知道這幹嘛用的，反正老師的有我就加進來了
//算了先註解掉，要用在打開
/*
這裡是本來的程式碼
const fs = require('fs');
*/

/*
 * Grants access for cross-origin HTTP requests.
 * See: https://developer.mozilla.org/en-US/docs/Web/HTTP/Access_control_CORS
 */

/*
這裡是本來的程式碼
module.exports = function(req, res, next) {
    res.set('Access-Control-Allow-Origin', '*');
    if (req.get('Access-Control-Request-Headers'))
        res.set('Access-Control-Allow-Headers', req.get('Access-Control-Request-Headers'));
    if (req.get('Access-Control-Request-Method'))
        res.set('Access-Control-Allow-Methods', req.get('Access-Control-Request-Method'));

    next();
};
*/
