
Vue.component("notice-adder",{
    props:['noticeDto']
    ,
    methods:{
        dispatcherEvent:function(){
            if(this.$parent.pattern==='insert'){
                this.submitNotice();
            }else{
                this.updateEvent();
            }
        }
        ,
        submitNotice:function(){
            this.$parent.notice.noticeContent=this.$parent.editor.txt.html();
            var that = this;
            oa.ajax.putRequest("/ws/notice/",this.$parent.notice,function(data){
                   oa.app.alertBox("操作结果",data.data);
                   that.$parent.getNoticeList();

            });
        }
        ,
        updateEvent:function(){
            this.$parent.notice.noticeContent=this.$parent.editor.txt.html();
            var that = this;
            oa.ajax.postRequest("/ws/notice/"+this.$parent.noticeId,this.$parent.notice,function(data){
                oa.app.alertBox("操作结果",data.data);
                that.$parent.getNoticeList();

            });
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
    "          <label for='noticeTitle'>公告标题</label> <input type='text' class='form-control' id='noticeTitle' v-model='noticeDto.noticeTitle'/>" +
    "       </div> " +
        "<div class='form-group'>\n" +
    "        <label for='onlyStaff'> <input type='checkbox' class='' id='onlyStaff' v-model='noticeDto.onlyStaff'/>只对下级可见</label>\n" +
    " </div> "+
    "<div id='editor'></div> \n" +
    "      </div>\n" +
    "      <div class=\"modal-footer\">\n" +
    "        <button type=\"button\" class=\"btn btn-primary\" @click='dispatcherEvent' " +
    ">{{noticeDto.noticeTitle===''?'发布':'保存更改'}}</button>\n" +
    "      </div>\n" +
    "    </div><!-- /.modal-content -->\n" +
    "  </div><!-- /.modal-dialog -->\n" +
    "</div><!-- /.modal -->"
});

var notice;
setTimeout(
    function(){
        notice=getNotice();
        var E = window.wangEditor;
        var editor = new E('#editor');
        // 或者 var editor = new E( document.getElementById('editor') )
        editor.create();
        notice.editor=editor;
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
            length:10,
            editor:null,
            pattern:'insert',
            notice:{
                noticeTitle:'',
                noticeContent:'',
                onlyStaff:false
            }
            ,
            search:''
        }
        ,

        methods:{
            createNotice:function () {
                this.pattern='insert';
                $("#noticeAdder").modal("show");
            }
            ,
            getNoticeList:function(){
                this.noticeList=[];
                var that=this;
                var url;
                if(this.search!==''){
                    url="/ws/notice/search?keyword="+this.search+"&page="+this.page+"&length="+this.length;
                }else{
                    url="/ws/notice/list?page="+this.page+"&length="+this.length;
                }


                oa.ajax.getRequest(url,
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
            updateNotice:function(event){
                this.getNoticeById(event.srcElement.dataset.noticeId);
                this.pattern='update';
                $("#noticeAdder").modal("show");
                this.editor.txt.html(this.notice.noticeContent);
            }
            ,
            getNoticeById:function(id){
                this.noticeId=id;
                var notice={
                    noticeTitle:'',noticeContent:'',onlyStaff:false
                };
                $.ajax({
                    url:"/ws/notice/"+id,
                    async:false,
                    success:function(data){
                        if(data.message==='success'){
                            notice.noticeTitle=data.data.noticeTitle;
                            notice.noticeContent=data.data.noticeContent;
                            notice.onlyStaff=data.data.onlyStaff;
                        }else{
                            console.log("get notice by id fail",data);
                        }
                    }
                    ,
                    error:function(data){
                        console.log("get notice by id fail",data);
                    }
                });
                this.notice=notice;

            }
            ,
            deleteNotice:function(event){
                var id=event.srcElement.dataset.noticeId;

                var that=this;
                oa.ajax.deleteRequest("/ws/notice/"+id,function(data){
                   oa.app.alertBox("操作结果",data.data);
                   that.getNoticeList();
                });
            }
            ,
            clear:function(){
                this.search='';
                this.getNoticeList();
            }

        }
    })
}