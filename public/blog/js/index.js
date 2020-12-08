let baseUrl = 'http://119.29.32.199:3000/api/blog/'

let vm = new Vue({
    el: '#app',
    data: {
        blog:[],
        blogNum:0,
        type:[],
        tag:[],
        rem:[],
        pageIndex:1,
        searchInfo:'',
        form:{
            title:'',
        }
    },
    filters:{
      formDate(date){
          return date.split('T')[0]
      }
    },
    methods: {
        // 获取文章
       getIndexBlog(num) {
           axios.post(baseUrl + 'indexBlog',{pageIndex:num})
           .then(res =>{
               if(res.data.code == 200){
                   this.blog = res.data.data.data;
                   this.blogNum = res.data.data.total;
                   this.pageTotal = res.data.data.pageTotal;
               }
           })
        },
        // 获取分类
        getTypeName(){
            axios.post(baseUrl + 'getALLType')
            .then(res => {
                this.type = res.data
                
            })
        },
        // 获取标签
        getTagALL(){
            axios.post(baseUrl+'getTagALL')
            .then(res => {
                this.tag = res.data
            })
        },
        //获取推荐文章
        getRemBlog(){
            axios.post(baseUrl + 'getRemBlog')
            .then(res =>{
                this.rem = res.data
            })
        },
        pre(){
            if(this.pageIndex > 1){
                this.pageIndex -= 1;
                this.getIndexBlog(this.pageIndex)
                $('html').scrollTop(0)
            }else{
                alert('已经是第一页了呀！')
            }
        },
        next(){
           if(this.pageIndex < this.pageTotal){
            this.pageIndex += 1;
            this.getIndexBlog(this.pageIndex)
            $('html').scrollTop(0)
           }else{
               alert('已经是最后一页咯！')
           }
        },
        // 搜索
        serach(){
            axios.post('/select',{
                title:this.form.title,
                recommend:'none',
                type:'none'
            })
        },
        //清空
        clear(){
            this.getIndexBlog(1)
        },
        goToDetail(id){
            window.location.href='/blog/blog.html?id='+id
        },
        gotoType(id){
            window.location.href='/blog/types.html?id='+id
        },
        gotoTag(id){
            window.location.href='/blog/tag.html?id='+id
        },
        successLoadImg(){
            console.log('图片加载完毕')
        },



    },
     created() {
       this.getIndexBlog(1)
       this.getTypeName()
       this.getRemBlog()
       this.getTagALL()

    }
})