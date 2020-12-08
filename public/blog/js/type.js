
let baseUrl = 'http://119.29.32.199:3000/api/blog/'


let vm = new Vue({
    el:'#app',
    data:{
        pageIndex:1,
        pageTotal:'',
        typeIdNow:'',
        type:[],
        blog:[],
        totalNum:'',
        pageSize:5, 
    },
    filters:{
      formDate(date){
          return date.split('T')[0]
      },

    },
    methods:{
        // 获取type下的文章
        getBlogByType(id){
            this.typeIdNow = id;
            axios.post(baseUrl+'getTagAllBlog',{
                pageIndex:this.pageIndex,
                id:id
            }).then(res =>{
                this.blog = res.data.data
                this.totalNum = res.data.total;
                this.pageTotal = Math.ceil(this.totalNum / this.pageSize)
            })
        },
        // 获取全部标签
        getTypeAll(typeId){
            axios.post(baseUrl+'getALLType')
            .then(res =>{
                this.type = res.data
                if(!typeId){
                    typeId = this.type[0].id
                }
                this.getBlogByType(typeId)
            })
        },

        // 上一页
        pre(){
            if(this.pageIndex > 1){
              this.pageIndex -=1;
              this.getBlogByType(this.tagIdNow)
            }else{
                alert('页数不在范围')
            }
        },
        next(){
            if(this.pageIndex < this.pageTotal){
                this.pageIndex +=1;
                this.getBlogByType(this.tagIdNow)
            }else{
                alert('页码不在范围')
            }
        },
        // 跳转到对应的博客详情
        gotoBlog(id){
            window.location.href='/blog/blog.html?id='+id
        }
    },
    created(){
        let url = window.location.search;
        if(url){
             this.typeIdNow = url.split('=')[1]
        }
        this.getTypeAll(this.typeIdNow);
       
    }
})