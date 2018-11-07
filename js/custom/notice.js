
Vue.component("notice-adder",{
    data:function(){
        return{

        }
    }
    ,
    template:"<div id='noticeAdder' class=\"modal fade bs-example-modal-lg\" tabindex=\"-1\" role=\"dialog\">\n" +
    "  <div class=\"modal-dialog modal-lg\" role=\"document\">\n" +
    "    <div class=\"modal-content\">\n" +
    "      <div class=\"modal-header\">\n" +
    "        <button type=\"button\" class=\"close\" data-dismiss=\"modal\" aria-label=\"Close\"><span aria-hidden=\"true\">&times;</span></button>\n" +
    "        <h4 class=\"modal-title\">发布公告</h4>\n" +
    "      </div>\n" +
    "      <div class=\"modal-body\" v-html=''>\n" +
    "      <div class='form-group'>" +
    "          <label for='noticeTitle'>公告标题</label> <input type='text' class='form-control' id='noticeTitle'/>" +
    "       </div> " +
        "<div class='form-group'>\n" +
    "        <label for='onlyStaff'> <input type='checkbox' class='' id='onlyStaff'/>只对下级可见</label>\n" +
    " </div> "+
    "<div id='editor'></div> \n" +
    "      </div>\n" +
    "      <div class=\"modal-footer\">\n" +
    "        <button type=\"button\" class=\"btn btn-primary\" data-dismiss=\"modal\"" +
    ">发布</button>\n" +
    "      </div>\n" +
    "    </div><!-- /.modal-content -->\n" +
    "  </div><!-- /.modal-dialog -->\n" +
    "</div><!-- /.modal -->"
});


setTimeout(
    function(){
        var notice=getNotice();
        var E = window.wangEditor;
        var editor = new E('#editor');
        // 或者 var editor = new E( document.getElementById('editor') )
        editor.create();
    }
),2500;

function getNotice(){
    return new Vue({
        el:"#notice",
        created:function(){
            this.getNoticeList();

        }
        ,
        data:{
            noticeList:[],
            page:1,
            length:10
        }
        ,
        methods:{
            createNotice:function () {
                $("#noticeAdder").modal("show");
            }
            ,
            getNoticeList:function(){
                var that=this;
                oa.ajax.getRequest("/ws/notice/list?page="+this.page+"&length="+this.length,
                    function(data){
                        if(data.message==='success'){
                            var list=data.data;
                            for(var i=0;i<list.length;i++){
                                that.noticeList.push({
                                   noticeId:list[i].noticeId,
                                   noticeTitle:list[i].noticeTitle,
                                   onlyStaff:list[i].onlyStaff,
                                   createTime:list[i].createTime
                                });
                            }
                        }else{
                            oa.app.alertBox("错误","获取公告列表失败");
                        }
                    }
                );
            }
            ,

        }
    })
}