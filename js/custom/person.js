
setTimeout(function () {

    if(hasLogin){
        let userInfo = getUserInfo();
    }
},2000);

function getUserInfo(){
    return new Vue({
       el:"#userInfo",
       data:{
           userInfo:{
               department:{}
           },
           profile:''
       }
       ,
        watch:{
           profile:function (val) {
               this.uploadProfile();
           }
        }
       ,
        created:function () {
            this.getUserInfo();
        }
       ,
        methods:{
           getUserInfo:function () {
               var that =this;
               oa.ajax.getRequest("/ws/userInfo/",function (data) {

                   if(data.message === 'success'){
                       that.userInfo=data.data;
                   }else{
                       console.log("get user info fail",data);
                   }
               })
           }
           ,
           uploadProfile:function () {
                console.log("exe");
               var formData = new FormData();
               formData.append('file', $('#userProfile')[0].files[0]);
               $.ajax({
                   url: '/ws/userInfo/profile',
                   type: 'POST',
                   cache: false,
                   data: formData,
                   processData: false,
                   contentType: false
               }).done(function(res) {
                   oa.app.showAlert("提示","更新头像成功");
               }).fail(function(res) {

                   console.log("upload profile fail",res);
               });

           } 
        }
    });
}