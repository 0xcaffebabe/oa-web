



var app=new Vue({
    el:"#loginPane",
    data:{
        username:'',
        password:'',
        usernameLimitState:'0/15',
        passwordLimitState:'0/16',
        loginButtonTitle:"登录"

    }
    ,
    methods:{
        login:function(){

            //校验用户名以及密码
            if(this.username===''){
                $("#username").shake(2,10,400);
                return;
            }


            if(this.password===''){
                $("#password").shake(2,10,400);
                return;
            }

            //发送登录请求
            oa.ajax.postRequest("/ws/login",{
                username:this.username,
                password:hex_md5(this.password)
            }, function(data){
                //登录成功则跳转页面
                if(data.message==="success"){
                    if(data.data==="登录成功"){
                        console.log("登录成功");
                        location="main.html";

                    }else{
                        app.loginButtonTitle="登录失败";
                        console.log("登录失败");
                    }
                }else{
                    app.loginButtonTitle="登录失败";
                    setTimeout(function(){
                        app.loginButtonTitle="登录";
                    },3500);
                    console.log("登录失败");
                }

            });
        }
        ,
        passwordChanged:function(event){
            if(event.keyCode===13){
                this.login();
            }
            this.passwordLimitState=this.password.length+"/"+16;
        },
        usernameChanged:function(){
            this.usernameLimitState=this.username.length+"/"+16;
        }
    }

});