
Vue.component("alert",{
    props:['alert'],
    template:"<div id='alert' class=\"modal fade\" style='z-index: 9999' tabindex=\"-1\" role=\"dialog\">\n" +
    "  <div class=\"modal-dialog\" role=\"document\">\n" +
    "    <div class=\"modal-content\">\n" +
    "      <div class=\"modal-header\">\n" +
    "        <button type=\"button\" class=\"close\" data-dismiss=\"modal\" aria-label=\"Close\"><span aria-hidden=\"true\">&times;</span></button>\n" +
    "        <h4 class=\"modal-title\">{{alert.alertTitle}}</h4>\n" +
    "      </div>\n" +
    "      <div class=\"modal-body\" v-html='alert.alertContent'>\n" +
    "        \n" +
    "      </div>\n" +
    "      <div class=\"modal-footer\">\n" +
    "        <button type=\"button\" class=\"btn btn-primary\" data-dismiss=\"modal\"" +
    " v-if='alert.closeButton.show'>{{alert.closeButton.text}}</button>\n" +
    "      </div>\n" +
    "    </div><!-- /.modal-content -->\n" +
    "  </div><!-- /.modal-dialog -->\n" +
    "</div><!-- /.modal -->"


});

Vue.component("nav-pane",{
    props:['user'],
    template:"<nav class=\"navbar navbar-inverse\">\n" +
    "        <div class=\"container-fluid\">\n" +
    "\n" +
    "            <div class=\"navbar-header\">\n" +
    "                <a href=\"\" class=\"navbar-brand\">OA</a>\n" +
    "            </div>\n" +
    "\n" +
    "            <!--导航条右上角用户信息区域-->\n" +
    "            <div id=\"userPane\">\n" +
    "                <img height=\"50\" width=\"50\" :src=\"user.userProfile\"\n" +
    "                     alt=\"\" class=\"userProfile img-circle\">\n" +
    "                <span style=\"color: white\">{{user.userFullName}}</span>\n" +
    "                <span class=\"label label-primary\">{{user.userDepartmentName}}</span>\n" +
    "                <!-- Split button -->\n" +
    "                <div class=\"btn-group\">\n" +
    "                    <button type=\"button\" class=\"btn btn-default btn-xs dropdown-toggle\" data-toggle=\"dropdown\" aria-haspopup=\"true\" aria-expanded=\"false\">\n" +
    "                        <span class=\"caret\"></span>\n" +
    "                    </button>\n" +
    "                    <ul class=\"dropdown-menu\">\n" +
    "                        <li><a href=\"#\">个人信息</a></li>\n" +
    "                        <li role=\"separator\" class=\"divider\"></li>\n" +
    "                        <li><a href=\"#\" @click=\"user.logout\">退出登录</a></li>\n" +
    "                    </ul>\n" +
    "                </div>\n" +
    "            </div>\n" +
    "\n" +
    "        </div>\n" +
    "    </nav>"
});

Vue.component("left-nav",{
   template:"<ul class=\"nav nav-pills nav-stacked\">\n" +
   "                <li role=\"presentation\" ><a href=\"main.html\">主页</a></li>\n" +
   "                <li role=\"presentation\" ><a href=\"event.html\">待办事项</a></li>\n" +
   "                <li role=\"presentation\"><a href=\"notice.html\">公告</a></li>\n" +
       "<li role=\"presentation\"><a href=\"checking.html\">考勤</a></li>"+
   "            </ul>"
});


jQuery.fn.shake = function (intShakes /*Amount of shakes*/, intDistance /*Shake distance*/, intDuration /*Time duration*/) {
    this.each(function () {
        var jqNode = $(this);
        jqNode.css({position: 'relative'});
        for (var x = 1; x <= intShakes; x++) {
            jqNode.animate({left: (intDistance * -1)}, (((intDuration / intShakes) / 4)))
                .animate({left: intDistance}, ((intDuration / intShakes) / 2))
                .animate({left: 0}, (((intDuration / intShakes) / 4)));
        }
    });
    return this;
};



function getOa() {
    return {
        ajax:{
            error:function(data){
                console.log("ajax error",data);
            }
            ,
            getRequest:function(url,callback){

                $.ajax({
                    url:url,
                    method:"GET",
                    success:callback,
                    error:this.error
                });
            }
            ,
            postRequest:function(url,data,callback){
                $.ajax({
                    url:url,
                    method:"POST",
                    headers:{"Content-Type":"application/json"},
                    data:JSON.stringify(data),
                    success:callback,
                    error:this.error
                });
            }
            ,
            putRequest:function(url,data,callback){
                $.ajax({
                    url:url,
                    method:"PUT",
                    headers:{"Content-Type":"application/json"},
                    data:JSON.stringify(data),
                    success:callback,
                    error:this.error
                });
            }
            ,
            deleteRequest:function (url,callback) {
                $.ajax({
                    url:url,
                    method:"DELETE",
                    success:callback,
                    error:this.error
                });
            }

        },
        vo:{
            Notice:function(){
                return {
                    noticeTitle:""
                }
            }
        }
        ,
        dto:{
            alert:function(){
                return {alertTitle:'',
                    alertContent:'',
                    closeEvent:null,
                    closeButton:{
                        show:false,
                        text:''
                    }
                };
            }
        }
        ,
        url:{
            checking:{
                checkingTimeURL:"/ws/checking/time",
                dutyStateURL:"/ws/checking/dutyState",
                recentCheckingListURL:"/ws/checking/self/recent",

            }
        }
        ,
        self:this
        ,
        checking:{
            onDutyTime:new Date(),
            offDutyTime:new Date(),
            isBeforeTime:function(date1,date2){
                return date1.getTime()-date2.getTime()<0;
            }
            ,
            isAfterTime(date1,date2){
                return date1.getTime()-date2.getTime()>0;
            }
            ,
            isBetweenTime:function (date1,date2,date3) {
                return this.isAfterTime(date1,date2) && this.isBeforeTime(date1,date3);
            }
            ,
            zeroTime:function(){
                var date=new Date();
                date.setHours(0);
                date.setMinutes(0);
                date.setSeconds(0);
                return date;
            }
        },
        app:new Vue({
            el:"#alertPane",
            data:{
                alert:{alertTitle:'',
                    alertContent:'',
                    closeEvent:null,
                    closeButton:{
                        show:false,
                        text:''
                    }
                }
            }
            ,
            methods:{
                showAlert:function(alert){
                    this.alert=alert;
                    $('#alert').on('hide.bs.modal', this.alert.closeEvent);
                    $("#alert").modal("show");

                }
                ,
                alertBox:function(title,content){
                    this.showAlert({
                        alertTitle:title,
                        alertContent:content,
                        closeButton:{
                            show:true,text:'关闭'
                        }

                    });
                }
            }
        })
        ,
        navPane:null



    };
}

function getNavPane(){
    return new Vue(
        {
            el: "#navPane",
            data: {
                user:{
                    userFullName: '',
                    userDepartmentName: '',
                    userProfile:'',
                    logout:function(){
                        oa.ajax.deleteRequest("/ws/login",function(data){
                            if(data.message==="success"){

                                location="./";
                            }else{
                                console.log("注销失败",data);
                            }
                        });
                    }
                }

            }
            ,
            created:function(){
                this.getUserInfo();
            }
            ,
            methods: {
                getUserInfo: function () {
                    var that=this;
                    oa.ajax.getRequest("/ws/userInfo", function (data) {
                        if (data.message === 'success') {
                            that.user.userFullName = data.data.fullName;
                            that.user.userDepartmentName = data.data.department.departmentName;
                            that.user.userProfile=data.data.userProfile;
                        } else {
                            console.log("获取userInfo 失败", data);
                        }


                    });
                }


            }
        }
    );
}

function getLeftNavPane(){
    return new Vue({
       el:"#leftNavPane",
        data:{
          activeMap:{}
        },
        created:function(){


        }
        ,
        methods:{
           choseActiveLeftNav:function(){
               var fileName=location.pathname.substring(location.pathname.lastIndexOf("/")+1,location.pathname.length);
               $("#leftNavPane a[href='"+fileName+"']").parent("li").addClass("active");
           }
        }
    });
}


var hasLogin=false;
var oa=getOa();


// 处理未登录情况
if(location.pathname.endsWith("/")){
    $("body").hide().show(1000).shake(2,25,400);
}else{

    $("body").hide().show(3000);
    oa.ajax.getRequest("/ws/login",function(data){

        if(data.data===true){
            hasLogin=true;
            oa.navPane=getNavPane();
            oa.leftNavPane=getLeftNavPane();
            oa.leftNavPane.choseActiveLeftNav();
        }else{
            //如果没有登录，跳回首页
            // location="./";
            oa.app.showAlert({
               alertTitle:"错误",
                alertContent:"未登录",
                closeButton:{
                   show:false,text:''
                }
                ,
                closeEvent:function(){
                   location="./";
                }
            });

        }
    });
}