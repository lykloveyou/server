const router = require('koa-router')()

const query = require('../model/model')

const decode = require('../utils/decode')


/**
 * 功能：首次展示，分页展示
 * @api：/type/getType
 * @method:post
 * @param：pageIndex (当前页码)。
 * @return  [{id:1,name:..},]
 */
router.post('/get', async (ctx) => {
    if (decode(ctx)) {
        if (ctx.request.body.all == 1) {
            let sql = 'SELECT * FROM type';

            await query(sql)
                .then(data => {
                    ctx.response.body = data
                })
        } else {
            // 获取当前总条数
            let sqlTotal = `SELECT COUNT(*) from type`;
            let total, pageTotal;
            await query(sqlTotal)
                .then(data => {
                    for (key in data[0]) {
                        total = data[0][key];
                    }
                }).catch(err => {
                    ctx.response.status = 500
                    ctx.response.body = `查询数据总条数失败${err}`
                })


            // 得到当前的页数码，和设定
            let pageIndex = ctx.request.body.pageIndex
            let pageSize = 5;

            // 判断可以多少页
            pageTotal = Math.ceil(total / pageSize)
            if (pageIndex > pageTotal) {
                ctx.response.status = 500
                ctx.response.body = {
                    "code": 403,
                    "mes": '页数超出范围'
                }

            } else if (pageIndex <= 0) {
                ctx.response.status = 500
                ctx.response.body = {
                    "code": 403,
                    "mes": '页数太小'
                }
            } else {
                // 分页查找
                let sql = `SELECT * FROM type LIMIT ${(pageIndex -1)*pageSize},${pageSize}`;

                await query(sql)
                    .then(data => {
                        ctx.body = {
                            data: data,
                            pageTotal: pageTotal
                        }
                    }).catch(err => {
                        ctx.response.status = 500
                        ctx.response.body = `查询数据失败${err}`
                    })

            }

        }

    } else {
        ctx.response.status = 401;
    }

})




/**
 * 功能：添加
 * @api：/type/addType
 * @method:post
 * @param:name(类名)
 * @return 200
 */
router.post('/add', async (ctx) => {
    if (decode(ctx)) {
        let listname = ctx.request.body.name

        let sql = `insert into type (name) values ('${listname}')`
        await query(sql)
            .then(() => {
                ctx.response.body = {
                    "code": 200,
                    "mes": '设置成功'
                }
            })
            .catch(err => {
                ctx.response.body = {
                    "code": 400,
                    "mes": '设置失败'
                }
            })
    } else {
        ctx.body.status = 401
    }


})





/**
 * 功能：查询单个数据
 * @api /type/signleType
 * @method post
 * @param  id
 */
router.post('/signle', async (ctx) => {
    if (decode(ctx)) {
        let id = ctx.request.body.id
        //根据id来查看数据返回数据

        let sql = 'SELECT * from type where id = ' + id
        await query(sql).then((data) => {
            ctx.response.body = {
                code: '200',
                data: data
            }
        })
    } else {
        ctx.response.status = 401
    }

})



/**
 * 功能：更新数据
 * @api /type/updateType
 * @method post
 * @param (id name)
 */
router.post('/update', async (ctx) => {
    if (decode(ctx)) {
        let id = ctx.request.body.id
        let typeName = ctx.request.body.name

        let sql = `UPDATE type set name = '${typeName}' where id = ${id}`
        await query(sql).then(() => {
            ctx.response.body = {
                code: '200',
                data: '修改成功'
            }
        })
    } else {
        ctx.response.status = 401
    }


})

/**
 * 功能：删除数据
 * @api /type/removeType
 * @method post
 * @param (id )
 */
router.post('/remove', async (ctx) => {
    if (decode(ctx)) {
        let id = ctx.request.body.id;
        let sql = `DELETE FROM type WHERE id = ${id}`
        await query(sql).then(() => {
            ctx.response.body = {
                code: '200',
                data: '删除成功'
            }
        })
    } else {
        ctx.response.status = 401
    }


})

module.exports = router.routes()