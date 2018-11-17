Vue.component("checking-data",{
    props:['checkingDataList']
    ,
    methods:{
        exportCheckingList:function(){
            window.open("/ws/checking/list/export/"+this.$parent.staffId+"?page=1&length=20");
        }
    }
    ,
    template:"<div id='checkingData' class=\"modal fade\"  tabindex=\"-1\" role=\"dialog\">\n" +
    "  <div class=\"modal-dialog\" role=\"document\">\n" +
    "    <div class=\"modal-content\">\n" +
    "      <div class=\"modal-header\">\n" +
    "        <button type=\"button\" class=\"close\" data-dismiss=\"modal\" aria-label=\"Close\"><span aria-hidden=\"true\">&times;</span></button>\n" +
    "        <h4 class=\"modal-title\">考勤数据</h4>\n" +
    "      </div>\n" +
    "      <div class=\"modal-body\" >\n" +
    "        <table class='table  table-striped table-hover'>" +
    "           <tr>" +
    "           <th>时间</th><th>类型</th>" +
    "           </tr>" +
    "<tr v-for='item in checkingDataList'><td>{{item.date}}</td><td>{{item.type}}</td></tr>" +
    "       </table>\n" +
        "<button class='btn btn-primary' @click='exportCheckingList'>导出数据</button>"+
    "      </div>\n" +
    "      <div class=\"modal-footer\">\n" +
    "        <button type=\"button\" class=\"btn btn-primary\" data-dismiss=\"modal\"" +
    ">关闭</button>\n" +
    "      </div>\n" +
    "    </div><!-- /.modal-content -->\n" +
    "  </div><!-- /.modal-dialog -->\n" +
    "</div><!-- /.modal -->"
});

Vue.component("info-show",{
    props:['info']
    ,
    template:"<div id='infoShow' class=\"modal fade\"  tabindex=\"-1\" role=\"dialog\">\n" +
    "  <div class=\"modal-dialog\" role=\"document\">\n" +
    "    <div class=\"modal-content\">\n" +
    "      <div class=\"modal-header\">\n" +
    "        <button type=\"button\" class=\"close\" data-dismiss=\"modal\" aria-label=\"Close\"><span aria-hidden=\"true\">&times;</span></button>\n" +
    "        <h4 class=\"modal-title\">{{info.fullName}}数据</h4>\n" +
    "      </div>\n" +
    "      <div class=\"modal-body\" >\n" +
        ""+
    "      </div>"+
    "      <div class=\"modal-footer\">\n" +
    "        <button type=\"button\" class=\"btn btn-primary\" data-dismiss=\"modal\"" +
    ">关闭</button>\n" +
    "      </div>\n" +
    "    </div><!-- /.modal-content -->\n" +
    "  </div><!-- /.modal-dialog -->\n" +
    "</div><!-- /.modal -->"
});



setTimeout(function () {

    if(hasLogin){
        var staff=getStaff();
    }
},2000);

function getStaff() {
    return new Vue({
       el:"#staff",
       data:{
           staffList:[],
           checkingDataList:[
               {date:new Date(),type:'test'}
           ]
           ,
           staffId:1,
           staffInfo:{}
       }
       ,
        created:function () {
            this.getStaffList();
        }
       ,
       methods:{
           getStaffList:function () {
               var that = this;
               oa.ajax.getRequest("/ws/staff/?page=1&length=10",function (data) {

                   if(data.message === 'success'){

                       that.staffList=data.data;

                   }else{
                       console.log("get staff list fail",data);
                   }
               });
           }
           ,
           checkingData:function (event) {
               var staffId=event.srcElement.dataset.userId;
               this.staffId=staffId;
               var that = this;
               oa.ajax.getRequest("/ws/checking/list/"+staffId+"?page=1&length=20",function (data) {
                    that.checkingDataList=[];
                   if(data.message==='success'){
                       for(var i=0;i<data.data.length;i++){
                           that.checkingDataList.push(
                               {
                                   date:data.data[i].checkingDate,
                                   type:data.data[i].checkingType==='OFF_DUTY'?"下班":"上班"
                               }
                           )
                       }


                   }else{
                       console.log("get checking data fail",data);
                   }
               });
               $("#checkingData").modal('show');
           },
           getStaffInfo:function (event) {

               var staffId = event.srcElement.dataset.userId;

               var that =this;
               oa.ajax.getRequest("/ws/userInfo/staff/"+staffId,function (data) {
                    if(data.message === 'success'){
                        that.staffInfo = data.data;
                        $("#infoShow").modal("show");
                    }else{
                        console.log("get user info fail",data);
                    }
               });
           }
       }
    });
}