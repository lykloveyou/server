const router = require('koa-router')()
const query = require('../model/model')



/**
 * 功能：评论展示
 * @api：/type/getType
 * @method:post
 */
router.post('/getComent', async (ctx) => {
    let blogId = ctx.request.body.blog_id

    // 获取当前总条数
    let sql = `SELECT * from comment where blog_id= ${blogId}`;
    await query(sql).then(data => {
        ctx.response.body = data;
    }).catch(err => {
        ctx.response.body = `查询数据失败${err}`
    })

})



/**
 * 功能：添加
 * @api：/type/add
 * @method:post
 * @param:name(类名)
 * @return 200
 */
router.post('/add', async (ctx) => {
    let {
        nickname,
        email,
        content,
        avatar,
        blog_id
    } = ctx.request.body


    let create_time = new Date()
    create_time = create_time.toLocaleDateString()
    if(!avatar){
        avatar = '/img/avatar2.jpg'
    }

    let sql = `insert into comment (nickname,email,content,avatar,blog_id,create_time) values ('${nickname}','${email}','${content}','${avatar}',${blog_id},'${create_time}') `

    await query(sql)
        .then(() => {
            ctx.response.body = {
                "code": 200,
                "mes": '设置成功'
            }
        })
        .catch(err => {
            console.log(err)
            ctx.response.body = {
                "code": 500,
                "mes": '设置失败'
            }
        })
})




module.exports = router.routes()