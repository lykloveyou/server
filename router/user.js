const query = require('../model/model');

const router = require('koa-router')()
let jwt = require('jwt-simple');

let jwtSecret = 'secret';

router.post('/login', async (ctx) => {
    let username = ctx.request.body.username;
    let password = ctx.request.body.password;
    let sql = `Select  email,nickname,avatar from user where username = '${username}' and password = '${password}'`
    await query(sql).then((data) => {
        if (data[0] != null) {
            let payload = data[0]
            let token = jwt.encode(payload,jwtSecret)
           
            ctx.response.body = {
                code:'200',
                mes:'登陆成功',
                token:token,
                data:data
            }
        } else {
            ctx.response.body = {
                code: 400,
                mess: '账号密码有误'
            }
        }
    })
})


module.exports = router.routes()