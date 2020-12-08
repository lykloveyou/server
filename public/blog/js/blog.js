let baseUrl = 'http://119.29.32.199:3000/api/blog/'
let baseCommentUrl = 'http://119.29.32.199:3000/api/comment/'

let vm = new Vue({

    el: '#app',
    data: {
        blogId: undefined,
        content: {
            update_time: '',
        },
        comments: [],
        form: {
            blog_id: '',
            nickname: '',
            email: '',
            content: '',
            avatar: '',
        }
    },
    filters: {
        formDate(date) {
            return date.split('T')[0]
        }
    },
    methods: {
        // 获取博客详情
        getBlog(id) {
            axios.get(baseUrl + 'signle?id=' + id).then(res => {
                if (res.data.code == 200) {
                    this.content = res.data.data[0]
                    axios.post(baseUrl + 'views',{id:id,views:this.content.views + 1})
                }
            })
        },
        // 获取对应评论信息
        getComment(id) {
            axios.post(baseCommentUrl + 'getComent', {
                    blog_id: id
                })
                .then(res => {
                    this.comments = res.data
                })
        },
        // 提交评论
        sumbit() {
            this.form.blog_id = this.blogId;
            if (this.form.nickname && this.form.email) {
                axios.post(baseCommentUrl + 'add', this.form)
                    .then(res => {
                        if (res.data.code == 200) {
                            alert('感谢你的评论！')
                            location.reload();
                        }
                    })
            } else {
                alert('这两项都不能为空哦！')
            }

        },

    },
    created() {
        let url = window.location.search;
        this.blogId = url.split('=')[1]
        this.getBlog(this.blogId)
        this.getComment(this.blogId)
    }
})


