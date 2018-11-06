

Vue.component("notice-shower",{
    props:['notice'],
    template:"<div id='noticeShower' class=\"modal fade\" tabindex=\"-1\" role=\"dialog\">\n" +
    "  <div class=\"modal-dialog\" role=\"document\">\n" +
    "    <div class=\"modal-content\">\n" +
    "      <div class=\"modal-header\">\n" +
    "        <button type=\"button\" class=\"close\" data-dismiss=\"modal\" aria-label=\"Close\"><span aria-hidden=\"true\">&times;</span></button>\n" +
    "        <h4 class=\"modal-title\">{{notice.noticeTitle}}</h4>\n" +
    "      </div>\n" +
    "      <div class=\"modal-body\">\n" +
    "<span>{{notice.noticeSender}}</span>"+
    "<span class='label label-primary'>{{notice.senderDepartment}}</span>"+
    "<span> {{notice.createTime}}</span>"+
    "<div>{{notice.noticeContent}}</div>"
    +
    "      </div>\n" +
    "      <div class=\"modal-footer\">\n" +
    "      </div>\n" +
    "    </div>\n" +
    "  </div>\n" +
    "</div>"

});


//只有当用户登录之后以下代码才会执行：
setTimeout(function(){
    if(hasLogin){
        const app=new Vue({
            el:"#noticeShowerPane",
            data:{
                notice:oa.vo.Notice(),
            }


        });

        const event=new Vue({
            el:"#eventPane",
            created:function(){
                this.getEventList();
            }
            ,
            data:{
                defaultView:'',
                eventList:[]

            }
            ,
            watch:{
                defaultView:function(){
                    this.createFullCalendar();

                }
            }
            ,
            methods:{
                createFullCalendar:function(){
                    $("#calc").fullCalendar("destroy");
                    $('#calc').fullCalendar({
                        defaultView: this.defaultView,
                        height:360,

                        selectable:true,
                        locale: 'zh-cn',
                        events: event.eventList,
                        eventRender: function(eventObj, $el) {
                            $el.popover({
                                title: eventObj.title,
                                content: eventObj.description,
                                trigger: 'hover',
                                placement: 'top',
                                container: 'body'
                            });
                        }
                        ,
                        dayClick: function(date, jsEvent, view) {

                            console.log(date,jsEvent,view)

                            // change the day's background color just for fun


                        }

                    });
                }
                ,
                getEventList:function(){
                    oa.ajax.getRequest("/ws/event/self",function(data){
                        if(data.message==="success"){
                            var list=data.data;

                            for(var i=0;i<list.length;i++){
                                event.eventList.push({
                                    title: list[i].eventName,
                                    start:list[i].eventStartTime,
                                    end:list[i].eventEndTime,
                                    description:list[i].eventDesc
                                });
                            }

                            event.defaultView='month';
                        }else{

                            console.log("get event list fail",data);
                        }

                    });



                }


            }
        });



        const notice=new Vue({
            el:"#noticePane",
            data:{
                noticeList:[]
            }
            ,
            created:function(){
                this.getNoticeList();
            }
            ,
            methods:{
                getNoticeList:function(){
                    oa.ajax.getRequest("/ws/notice/self",function(data){
                        if(data.message==='success'){
                            notice.noticeList=data.data;
                        } else{
                            console.log("get notice list error",data);
                        }
                    });
                }
                ,
                showNoticeContent:function(event){
                    var index=event.srcElement.dataset.index;
                    var noticeDto=notice.noticeList[index];
                    app.notice.noticeTitle=noticeDto.noticeTitle;
                    app.notice.noticeContent=noticeDto.noticeContent;
                    app.notice.noticeSender=noticeDto.noticeSender.userInfo.fullName;
                    app.notice.senderDepartment=noticeDto.noticeSender.userInfo.department.departmentName;
                    app.notice.createTime=noticeDto.createTime;
                    $("#noticeShower").modal("show");

                }
            }
        });

        const checking=new Vue({
            el:"#checkingPane",
            data:{
                checkingTime:{},
                dutyState:{},
                checkingButtonDisable:false,
                checkingButtonText:"上班打卡",
                checkingText:"",
                currentTime:null,
                recentCheckingList:[]
            }
            ,
            created:function(){
                this.getCheckingTime();
                this.getDutyState();
                console.log(new Date());
                this.getRecentCheckingList();

            }
            ,
            methods:{
                checking:function(){
                    oa.ajax.postRequest("/ws/checking/",null,function(data){
                        checking.getDutyState();
                    });
                }
                ,
                getCheckingTime:function(){
                    oa.ajax.getRequest(oa.url.checking.checkingTimeURL,function(data){
                        checking.checkingTime=data.data;
                        console.log(oa.checking.isBetweenTime(new Date(),oa.checking.zeroTime(),new Date(checking.checkingTime.onDutyTime)));
                        checking.getDutyState();
                    });

                }
                ,
                getDutyState:function(){
                    oa.ajax.getRequest(oa.url.checking.dutyStateURL,function(data){
                        checking.dutyState=data.data;
                        checking.calcCheckingState();
                    });
                }
                ,
                calcCheckingState:function(){


                    if(oa.checking.isBetweenTime(this.getCurrentDateTime(),oa.checking.zeroTime(),new Date(this.checkingTime.onDutyTime))===true){
                        /*0点到上班时间这段时间
                        *
                        *   这段时间禁止打卡，并且倒计时显示距离上班打卡的时间
                        * */
                        console.log("现在是0~8");
                        this.checkingButtonDisable=true;
                        var s=setInterval(function(){
                            if(oa.checking.isAfterTime(checking.getCurrentDateTime(),new Date(checking.checkingTime.onDutyTime))){
                                checking.checkingButtonDisable=false;
                                checking.checkingText="可上班打卡";
                                clearInterval(s);
                                return;

                            }
                            checking.checkingText=(new Date(checking.checkingTime.onDutyTime).getTime()-checking.getCurrentDateTime().getTime())/1000+"秒后可上班打卡";
                        },1000);

                    }else if(oa.checking.isBetweenTime(this.getCurrentDateTime(),new Date(this.checkingTime.onDutyTime),new Date(this.checkingTime.offDutyTime))===true){
                        /*上班时间到下班时间这段时间
                        *
                        *   这段时间进行判断，若已经上班打卡了，则显示到下班打卡的时间
                        *   否则允许打卡，类型为上班
                        * */


                        if(this.dutyState.onDuty===true){
                            //上班已打卡
                            this.checkingButtonDisable=true;
                            this.checkingButtonText="上班已打卡";

                            var s=setInterval(function(){
                                if(oa.checking.isAfterTime(checking.getCurrentDateTime(),new Date(checking.checkingTime.offDutyTime))){
                                    checking.checkingButtonDisable=false;
                                    checking.checkingButtonText="下班打卡";
                                    checking.checkingText="可下班打卡";
                                    clearInterval(s);
                                    return;

                                }
                                checking.checkingText=(new Date(checking.checkingTime.offDutyTime).getTime()-checking.getCurrentDateTime().getTime())/1000+"秒后可下班打卡";
                            },1000);
                        }

                    }else{
                        /*下班时间到0点这段时间
                        *
                        *   允许打卡，类型为下班（如果还没下班打卡）
                        * */
                        console.log("现在是17~0");
                        this.checkingButtonText="下班打卡";

                        if(this.dutyState.offDuty===true){ //下班已打卡
                            this.checkingText="今日下班已打卡";
                            this.checkingButtonDisable=true;
                        }else{
                            this.checkingText="下班可打卡";
                            this.checkingButtonDisable=false;
                        }
                    }
                }
                ,
                getCurrentDateTime:function(){
                    /*
                    * 这段代码第一次执行会从服务器获取当前系统时间
                    * 其余执行都直接从缓存返回
                    * 并且第一次获取时间到缓存后会有一条线程对这个时间进行加1000毫秒的操作
                    * */
                    if(this.currentTime!=null){
                        return this.currentTime;
                    }

                    var dateTime;
                    $.ajax({
                        url:"/ws/checking/currentTime",
                        async:false,
                        success:function(data){
                            dateTime=new Date(data.data);
                        }

                    });
                    var that=this;
                    that.currentTime=dateTime;
                    setInterval(function(){
                        that.currentTime.setTime(that.currentTime.getTime()+1000);
                    },1000);
                    return that.currentTime;
                }
                ,
                getRecentCheckingList:function(){
                    var that=this;
                    oa.ajax.getRequest("/ws/checking/self/recent",function (data) {

                        if(data.message==='success'){

                            that.recentCheckingList=data.data;
                        }else{
                            console.log("get recent checking list fail",data);
                        }
                    });
                }

            }
        });
    }
},1000);

