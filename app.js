const Koa = require('Koa')
const static = require('koa-static')  
const router = require('koa-router')();
const path = require('path')
const views = require('koa-views')
const cors = require('koa2-cors');

// 程序应用
const app = new Koa()
app.use(cors());

//使用模板引擎
app.use(views(path.join(__dirname,'./views'),{
    extension:'ejs'
}))

const bodyParser = require('koa-bodyparser')
app.use(bodyParser())

// 配置路由

router.use('/api',require('./router/index'))


 /*启动路由*/
app.use(router.routes());  
app.use(router.allowedMethods());

// 静态资源
const staticPath = './public'
app.use(static(
    path.join(__dirname,staticPath)
))


app.listen(3000,()=>{
    console.log('服务器开启')
})