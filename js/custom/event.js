
Vue.component("event-adder",{
    data:function(){
        return {
            allDay: this.allDay
        }


    },
    watch:{
        allDay:function(val){
            this.allDay=val;

        }

    },
    methods:{
      submitEvent:function(){
          var eventDto={
              eventName:$("#eventName").val(),
              eventDesc:$("#eventDesc").val(),
              eventStart:$("#eventStart").val(),
              eventEnd:$("#eventEnd").val()
          };

          for(var key in eventDto){
              if(eventDto[key]===''){
                  $("#"+key).shake(2,10,400);
              }else{

              }
          }

          if(this.allDay){
              eventDto.eventStart=this.event.date;
              eventDto.eventEnd=this.event.date;

          }else{

          }
          console.log(eventDto);


      }
    },
    props:['event'],
    template:"<div id='eventAdder' class=\"modal fade\" tabindex=\"-1\" role=\"dialog\">\n" +
    "  <div class=\"modal-dialog\" role=\"document\">\n" +
    "    <div class=\"modal-content\">\n" +
    "      <div class=\"modal-header\">\n" +
    "        <button type=\"button\" class=\"close\" data-dismiss=\"modal\" aria-label=\"Close\"><span aria-hidden=\"true\">&times;</span></button>\n" +
    "        <h4 class=\"modal-title\">{{event.title}}</h4>\n" +
    "      </div>\n" +
    "      <div class=\"modal-body\" v-html=''>\n" +
    "        <div class='form-group' >" +
    "           <label for='eventName' > 事件标题</label><input type='text' id='eventName' class='form-control' />" +
    "        </div>" +
    "<div class='form-group' >\n" +
    "          <label for='eventStart'  v-if='!allDay' >事件开始时间</label><input type='datetime-local' id='eventStart' class='form-control' v-show='!allDay'/>\n" +
    "</div>"+
    "      <div class='form-group' >\n" +
    "          <label for='eventEnd'  v-if='!allDay' > 事件结束时间</label><input type='datetime-local' id='eventEnd'  class='form-control' v-show='!allDay'/>\n" +
    "     </div>"+
        "<div class='form-group' >\n" +
    "<div class=\"checkbox\">\n" +
    "    <label>\n" +
    "      <input type=\"checkbox\" v-model='allDay'> 全天事件" +
    "    </label>\n" +
    "  </div>"+
    "          <label for='eventDesc' > 事件描述</label><textarea type='text' id='eventDesc' class='form-control'></textarea>" +
    "</div>"+
    "      </div>\n" +
    "      <div class=\"modal-footer\">\n" +
    "        <button type=\"button\" @click='submitEvent' class=\"btn btn-primary\"" +
    " >保存</button>\n" +
    "      </div>\n" +
    "    </div><!-- /.modal-content -->\n" +
    "  </div><!-- /.modal-dialog -->\n" +
    "</div><!-- /.modal -->"


});

setTimeout(function () {
    if(hasLogin){
        var event=getEvent();

    }
},2500);

function getEvent(){
        return new Vue({
            el:"#event",
            created:function(){
                this.getEventList();

            }
            ,
            data:{
                defaultView:'',
                eventList:[],
                event:{},
                allDay:false,
                eventStart: {},
                eventEnd: {},
                eventName: '',
                eventDesc: '',

            }
            ,
            watch:{
                defaultView:function(){
                    this.createFullCalendar();

                }
                ,
                allDay:function(){
                    this.allDayDisabled=true;
                }
            }
            ,
            methods:{
                createFullCalendar:function(){
                    var that=this;
                    $("#calc").fullCalendar("destroy");
                    $('#calc').fullCalendar({
                        defaultView: this.defaultView,
                        height:560,

                        selectable:true,
                        locale: 'zh-cn',
                        events: that.eventList,
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

                            console.log(date,"触发添加事件事件");
                            var event={
                                title:date.toISOString()+"添加事件",
                                date:date._d
                            };


                            that.createEvent(event);


                        }
                        ,
                        eventClick: function(calEvent, jsEvent, view) {

                            console.log("触发事件更改事件",calEvent);

                        }

                    });
                }
                ,
                getEventList:function(){
                    var that=this;
                    oa.ajax.getRequest("/ws/event/self",function(data){
                        if(data.message==="success"){
                            var list=data.data;

                            for(var i=0;i<list.length;i++){
                                that.eventList.push({
                                    id:list[i].eventId,
                                    title: list[i].eventName,
                                    start:list[i].eventStartTime,
                                    end:list[i].eventEndTime,
                                    description:list[i].eventDesc
                                });
                            }

                            that.defaultView='month';
                        }else{

                            console.log("get event list fail",data);
                        }

                    });



                },
                createEvent:function (event) {
                    this.event=event;
                    //如果所选择日期已经是过去
                    if(event.date.getTime()-new Date().getTime()<-24*3600*1000){

                    }else{
                        $("#eventAdder").modal("show");
                        $("#eventStart").val(event.date.toISOString().substr(0,event.date.toISOString().length-1));
                        $("#eventEnd").val(event.date.toISOString().substr(0,event.date.toISOString().length-1));
                    }


                }


            }
        });
    }