
let baseUrl = 'http://119.29.32.199:3000/api/blog/'


let vm = new Vue({
    el:'#app',
    data:{
        pageIndex:1,
        pageTotal:'',
        tagIdNow:'',
        tag:[],
        blog:[],
        totalNum:'',
        pageSize:5, 
    },
    filters:{
      formDate(date){
          return date.split('T')[0]
      }
    },
    methods:{
        // 获取tag下的文章
        getBlogByTag(id){
            this.tagIdNow = id;
            axios.post(baseUrl+'getBlogByTag',{
                pageIndex:this.pageIndex,
                id:id
            }).then(res =>{
                this.blog = res.data.data
                this.totalNum = res.data.num;
                this.pageTotal = Math.ceil(this.totalNum / this.pageSize)
            })
        },
        // 获取全部标签
        getTagAll(typeId){
            axios.post(baseUrl+'getTagALL')
            .then(res =>{
                this.tag = res.data
                if(!typeId){
                    typeId =this.tag[0].id
                }
                this.getBlogByTag(typeId)
            })
        },

        // 上一页
        pre(){
            if(this.pageIndex > 1){
              this.pageIndex -=1;
              this.getBlogByTag(this.tagIdNow)
            }else{
                alert('页数不在范围')
            }
        },
        next(){
            if(this.pageIndex < this.pageTotal){
                this.pageIndex +=1;
                this.getBlogByTag(this.tagIdNow)
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
             this.tagIdNow = url.split('=')[1]
        }
        this.getTagAll(this.tagIdNow);
       
    }
})