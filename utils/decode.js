let jwt = require('jwt-simple');
let jwtSecret = 'secret';

function decode(ctx) {

    let token
    if (ctx.request.header.authorization) {
        token = ctx.request.header.authorization
        try {
            let result = jwt.decode(token, jwtSecret);
            return true;
        } catch (err) {
            ctx.response.status = 403
            return false
        }

    }
    return false;

}

function formdate(time){
    let time1 = time.splie('T')[0];
    let newTime = time1.splie('-')[0];
    return newTime
}

module.exports = decode;