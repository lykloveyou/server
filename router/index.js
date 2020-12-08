const router = require('koa-router')()

router.use('/blog',require('./blog'))          //关于博客
router.use('/tag',require('./tag'))            //关于标签
router.use('/type',require('./type'))          //关于分类
router.use('/comment',require('./comment'))     //关于评论
router.use('/user',require('./user'))          //关于用户



module.exports = router.routes()