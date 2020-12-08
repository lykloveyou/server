let baseUrl = 'http://119.29.32.199:3000/api/blog/'

let vm = new Vue({
    el: '#app',
    data: {
        num: 0,
        allList: {},
        years: [],
        allListChaneg: []
    },
    filters:{
       formDate(date){
           let newDate = date.split('T')[0];
          return newDate.split('-')[1] +'月'+ newDate.split('-')[2]+'日'
       }
    },
    methods: {
        getList() {
            axios.post(baseUrl + 'getTimeAll')
                .then(res => {
                    if (res.data.code == 200) {
                        this.num = res.data.totalNum
                        this.allList = res.data.data
                        for (key in this.allList) {
                            this.years.push(key)
                            this.allListChaneg.push(this.allList[key])
                        }
                    }
                 console.log(this.allListChaneg)
                })
        },
        goToDetail(id){
            window.location.href='/blog/blog.html?id='+id
        }
    },
    created() {
        this.getList()
    }
})