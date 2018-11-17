setTimeout(function () {

    if (hasLogin) {
        var message=getMessage();
    }
}, 1500);

function getMessage() {
    return new Vue({
        el: "#message",
        created:function(){
            this.getOnlineUserList();
        }
        ,
        data: {
            onlineUserList:[]
        }
        ,
        methods: {
            getOnlineUserList:function () {
                var that=this;
                oa.ajax.getRequest("/ws/communication/onlineUser",function (data) {

                    if(data.message==="success"){
                        that.onlineUserList=data.data;
                    }else{
                        console.log("get online user fail",data);
                    }

                });

            }
            ,
            sendMsg:function (event) {
                var userId=event.srcElement.dataset.toId;
                $("#messageContainer").modal("show");
                oa.communication.messageContainer.message.messageTo.userId=userId;
                console.log(userId);
            }
        }
    });
}