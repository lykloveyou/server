const router = require('koa-router')()

const query = require('../model/model')

const decode = require('../utils/decode')

const formdate = require('../utils/formdate.js')

/**
 * 功能：首次展示，分页展示
 * @api：/type/getType
 * @method:post
 * @param：pageIndex (当前页码)。
 * @return  [{id:1,name:..},]
 */
router.post('/get', async (ctx) => {

    if (decode(ctx)) {
        // 获取当前总条数
        let sqlTotal = `SELECT COUNT(*) from blog`;
        let total, pageTotal;
        await query(sqlTotal).then(data => {
            for (key in data[0]) {
                total = data[0][key];
            }
        }).catch(err => {
            ctx.body = `查询数据总条数失败${err}`
        })

        // 得到当前的页数码，和设定
        let pageIndex = ctx.request.body.pageIndex
        let pageSize = 5;

        // 判断可以多少页
        pageTotal = Math.ceil(total / pageSize)
        if (pageIndex > pageTotal) {
            ctx.response.body = {
                "code": 403,
                "mes": '页数超出范围'
            }

        } else if (pageIndex <= 0) {
            ctx.response.body = {
                "code": 403,
                "mes": '页数太小'
            }
        } else {
            // 分页查找
            let sql = `SELECT * FROM blog LIMIT ${(pageIndex -1)*pageSize},${pageSize}`;
            await query(sql).then(data => {
                ctx.body = {
                    data: data,
                    pageTotal: pageTotal
                };
            }).catch(err => {
                ctx.body = `查询数据失败${err}`
            })
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
        let {
            title,
            first_pic,
            type,
            tag,
            recommend,
            commentabled,
            published,
            shareStatement,
            appreciation,
            content,
            flag,
            descti,
            html,
        } = ctx.request.body

        let create_time = new Date();
        create_time = create_time.toLocaleDateString();
        let update_time = create_time;
        let views = 0;

        let sql = `insert into blog (title,first_pic,type,recommend,commentabled, published,shareStatement,appreciation,content,flag,descti,html,create_time,update_time,views) values ('${title}','${first_pic}',${type},${recommend},${commentabled},${published},${shareStatement},${appreciation},'${content}','${flag}','${descti}','${html}','${create_time}','${update_time}','${views}')`
        let blog_id;
        await query(sql)
            .catch(err => ctx.response.status = 500)
        await query('select max(id) from blog')
            .then((data) => {
                for (key in data[0]) {
                    blog_id = data[0][key];
                }
            })
        for (key of tag) {
            let sql_Blog_Tag = `insert into blog_tag (blog_id,tag_id) values (${blog_id},${key})`;
            await query(sql_Blog_Tag).catch(err => ctx.response.status = 500)
        }

        ctx.response.body = {
            code: 200,
            mes: '添加成功'
        }

    } else {
        ctx.response.status = 401;
    }


})

/**
 * 功能：搜索
 * www + admin
 *
 */

function sqlSelection(title, recommend, type) {
    let sql;
    if (title !== 'none' && recommend !== 'none' && type !== 'none') {
        sql = `SELECT * from blog where title like '%${title}%' and recommed = ${recommend} and type = ${type}`
        return sql
    } //abc
    else if (title !== 'none' && recommend === 'none' && type === 'none') {
        sql = `SELECT * from blog where title like '%${title}%'`
        return sql
    } //a
    else if (title === 'none' && recommend !== 'none' && type === 'none') {
        sql = `SELECT * from blog where  recommed = ${recommend}`
        return sql
    } //b
    else if (title === 'none' && recommend === 'none' && type !== 'none') {
        sql = `SELECT * from blog where  type = ${type}`
        return sql
    } //c
    else if (title !== 'none' && recommend !== 'none' && type === 'none') {
        sql = `SELECT * from blog where title like '%${title}%' and recommed = ${recommend}`
        return sql
    } //ab
    else if (title !== 'none' && recommend === 'none' && type !== 'none') {
        sql = `SELECT *  from blog where title like '%${title}%' and type = ${type}`
        return sql
    } //ac
    else if (title === 'none' && recommend !== 'none' && type !== 'none') {
        sql = `SELECT * from blog where recommed = ${recommend} and type = ${type}`
        return sql
    } //bc
}

router.post('/select', async (ctx) => {

    let {
        title,
        recommend,
        type
    } = ctx.request.body;

    let sql = sqlSelection(title, recommend, type)
    await query(sql).then((data) => {
        ctx.response.body = data
    })


})



/**
 * 功能：查询单个数据
 * @api /type/signleType
 * @method post
 * @param  id
 */
/**
 * www:获取博客详情
 */
router.get('/signle', async (ctx) => {
    let id = ctx.request.query.id
    //根据id来查看数据返回数据
    let sql = 'SELECT * from blog where id = ' + id
    let data = await query(sql)
    data[0].html = data[0].html.toString()
    // 查询id下的分类
    let sqlType = `Select name from type where id = ${data[0].type}`
    let type = await query(sqlType)
    data[0].type = type[0].name
    ctx.response.body = {
        code: '200',
        data: data,
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
        let {
            title,
            first_pic,
            type,
            tag,
            recommend,
            commentabled,
            published,
            shareStatement,
            appreciation,
            content,
            flag,
            descti,
            html,
            id
        } = ctx.request.body

        let sqlRemTag = `DELETE FROM blog_tag WHERE blog_id = ${id} `
        let data = await query(sqlRemTag);

        if (data) {
            for (key of tag) {
                let sql_Blog_Tag = `insert into blog_tag (blog_id,tag_id) values (${id},${key})`;
                await query(sql_Blog_Tag).then(data => {

                    })
                    .catch(err => ctx.response.status = 500)
            }
            let update_time = new Date();
            update_time = update_time.toLocaleDateString();
            let sql = `update blog set title = '${title}',first_pic = '${first_pic}',type = ${type},recommend= ${recommend},commentabled= ${commentabled}, published= ${published},shareStatement= ${shareStatement},appreciation= ${appreciation},content= '${content}',flag= '${flag}',descti= '${descti}',html= '${html}',update_time= '${update_time}' where id = ${id}`

            await query(sql).then(() => {
                ctx.response.body = {
                    code: '200',
                    data: '修改成功'
                }
            })
        }

    } else {
        ctx.response.status = 401;
    }


})

/**
 * 功能：修改发布还是保存状态
 */
router.post('/publish', async (ctx) => {
    if (decode(ctx)) {
        let id = ctx.request.body.id;
        let sql = `update blog set published = 2 where id = '${id}'`
        await query(sql)
            .catch(err => {
                ctx.response.body = {
                    code: 500,
                    mes: '发布失败'
                }
            })
            .then(data => {
                if (data) {
                    ctx.response.body = {
                        code: 200,
                        mes: '发布成功'
                    }
                }
            })
    } else {
        ctx.response.status = 401;
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
        let sql = `DELETE FROM blog WHERE id = ${id}`
        await query(sql).then(() => {
            ctx.response.body = {
                code: '200',
                data: '删除成功'
            }
        })
    } else {
        ctx.response.status = 401;
    }

})


/**
 * 功能:查出一个博客的所有标签
 */
router.post('/tag_blog_one', async (ctx) => {
    if (decode(ctx)) {
        let blog_id = ctx.request.body.blog_id;
        let sql = `SELECT tag_id from tag,(SELECT tag_id from blog_tag where  blog_id = ${blog_id}) as t1 where tag.id = t1.tag_id;`
        let data = await query(sql)
        let obj = [];
        for (key of data) {
            obj.push(key['tag_id'])
        }
        data = obj;
        ctx.response.body = {
            code: 200,
            data: data
        }
    } else {
        ctx.response.status = 401;
    }
})

/**
 * www:页面的接口
 */
/**
 * www:归档
 */
router.post('/getTimeAll', async (ctx) => {
    //查询时间个数和顺序
    let sql = `Select id,title,flag,create_time from blog`
    let obj = {}
    let data = await query(sql)

    for (let i = 0; i < data.length; i++) {
        let year = formdate(data[i].create_time)
        if (!obj.hasOwnProperty(year)) {
            obj[year] = []
        }
        obj[year].push(data[i])
    }
    ctx.response.body = {
        code: 200,
        totalNum: data.length,
        data: obj
    };
})

// www:分类页面
router.post('/getTagAllBlog', async (ctx) => {

    let typeid = ctx.request.body.id
    let pageIndex = ctx.request.body.pageIndex;
    let pageSize = 5;
    let sqlCountAll = `SELECT count(*) from blog WHERE type = ${typeid}`
    let num = await query(sqlCountAll)
    num = num[0]['count(*)']

    let sql = `SELECT id,title,views,update_time,first_pic,descti from blog WHERE type = ${typeid} LIMIT ${(pageIndex -1)*pageSize},${pageSize};`

    let data = await query(sql)
    for (key of data) {
        let blogTagAllsql = `SELECT name from (SELECT tag_id from blog_tag WHERE blog_id = ${key.id}) as t1, tag as t2 where t1.tag_id = t2.id;`
        key.tag = await query(blogTagAllsql)
    }
    ctx.response.body = {
        total: num,
        data: data
    }


})

// 分类个数
router.post('/getALLType', async (ctx) => {
    let sql = `SELECT type.id,type.name,blog.id as blog_id from type left OUTER join blog on type.id = blog.type;`
    data = await query(sql)
    let obj = {}
    for (key of data) {
        if (!obj[key.name] && key.blog_id == null) {
            obj[key.name] = {
                id: key.id,
                name: key.name,
                num: 0,
            }
        } else if (!obj[key.name] && key.blog_id != null) {
            obj[key.name] = {
                id: key.id,
                name: key.name,
                num: 1,
            }

        } else {
            obj[key.name] = {
                id: key.id,
                name: key.name,
                num: obj[key.name].num + 1,
            }
        }
    }

    ctx.response.body = Object.values(obj);
})

//标签
router.post('/getTagALL', async (ctx) => {
    let sql = 'Select * from tag'
    let data = await query(sql)
    ctx.response.body = data;
})

// 推荐的文章
router.post('/getRemBlog', async (ctx) => {
    let sql = 'Select id,title from blog where appreciation = 1 limit 0,8';
    let data = await query(sql);
    ctx.response.body = data
})
// 首页
router.post('/indexBlog', async (ctx) => {
    let pageIndex = ctx.request.body.pageIndex;
    let pageSize = 10;
    // 获取总数
    let sqlAll = `Select count(id) from blog`;
    let num = await query(sqlAll);
    for (key in num[0]) {
        num = num[0][key];
    }
    pageTotal = Math.ceil(num / pageSize)
    // 分页，首次(1)，
    let sqlBlog = `Select id,title,views,update_time,first_pic,descti from blog where published = 2 limit ${(pageIndex -1)*pageSize},${pageSize}`
    let data = await query(sqlBlog)
    for (key of data) {
        // 添加类型
        let blogTagAllsql = `SELECT name from (SELECT tag_id from blog_tag WHERE blog_id = ${key.id}) as t1, tag as t2 where t1.tag_id = t2.id;`
        key.tag = await query(blogTagAllsql)
    }
    ctx.response.body = {
        code: 200,
        data: {
            total: num,
            data: data,
            pageTotal: pageTotal,
        }
    }
})

// 标签获取文章
router.post('/getBlogByTag', async (ctx) => {
    let tagId = ctx.request.body.id
    let pageIndex = ctx.request.body.pageIndex;
    let pageSize = 5;

    let totalNumSql = `SELECT count(*) from blog,(SELECT blog_id from blog_tag where tag_id = ${tagId}) as t1  where blog.id = t1.blog_id`

    let num = await query(totalNumSql)

    num = num[0]['count(*)']

    let sql = `SELECT id,title,views,update_time,first_pic,descti from blog,(SELECT blog_id from blog_tag where tag_id = ${tagId}) as t1  where blog.id = t1.blog_id LIMIT ${(pageIndex -1)*pageSize},${pageSize}`

    let data = await query(sql)
    ctx.response.body = {
        num: num,
        data: data
    };
})


// 添加浏览次数
router.post('/views',async(ctx) => {
    let {id, views} = ctx.request.body
    let sql=`update blog set views = ${views} where id=${id}`;
    let data = await query(sql)
    ctx.response.body = {
        code:200
    }
    
})
module.exports = router.routes()