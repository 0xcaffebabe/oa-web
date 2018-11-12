
setTimeout(function(){

    if(hasLogin){
        var checking=getChecking();
    }
},2500);

function getChecking(){

    return new Vue({
      el:"#checking",
      created:function () {
          this.getCheckingInfo();
          this.getCheckingList();
      }
      ,
      data:{
          checkingInfo:{
              checkingRate:0.0,
              onTimeRate:0.0,
              avgWorkDuration:0.0
          }
          ,
          checkingList:[]
      }
      ,
      methods:{
          getCheckingInfo:function(){
              var that = this;
              oa.ajax.getRequest("/ws/checking/info",function(data){

                  if(data.message==="success"){
                      that.checkingInfo = data.data;

                  }else{
                      console.log("get checking info fail",data);
                  }
              });
          }
          ,
          getCheckingList:function () {
              var that=this;

              oa.ajax.getRequest("/ws/checking/list?page=1&length=7",function (data) {

                  if(data.message==="success"){

                      for(var i=0;i<data.data.length;i++){
                          that.checkingList.push({
                              checkingId:data.data[i].checkingId,
                              checkingDate:data.data[i].checkingDate,
                              checkingType:data.data[i].checkingType==="ON_DUTY"?"上班":"下班"
                          });
                      }

                  }else{
                      console.log("get checking list fail",data);
                  }
              });
          }


      }
    });
}

chart();
function chart(){
    console.log("run");
    Chart.defaults.global.defaultFontColor = 'white';
    console.log(Chart.defaults.radar);
    var ctx = document.getElementById("myChart").getContext('2d');
    var myChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ["Red", "Blue", "Yellow", "Green", "Purple", "Orange"],
            datasets: [{
                label: '# of Votes',
                data: [12, 19, 3, 5, 2, 3],
                backgroundColor: [
                    'rgba(255, 99, 132, 0.2)',
                    'rgba(54, 162, 235, 0.2)',
                    'rgba(255, 206, 86, 0.2)',
                    'rgba(75, 192, 192, 0.2)',
                    'rgba(153, 102, 255, 0.2)',
                    'rgba(255, 159, 64, 0.2)'
                ],
                borderColor: [
                    'rgba(255,99,132,1)',
                    'rgba(54, 162, 235, 1)',
                    'rgba(255, 206, 86, 1)',
                    'rgba(75, 192, 192, 1)',
                    'rgba(153, 102, 255, 1)',
                    'rgba(255, 159, 64, 1)'
                ],
                borderWidth: 1
            }]
        },
        options: {
            scales: {
                yAxes: [{
                    ticks: {
                        beginAtZero:true
                    }
                }]
            }
        }
    });
    var ctx1 = document.getElementById("myChart1").getContext('2d');
    var myRadarChart = new Chart(ctx1, {
        type: 'radar',
        data: {
            labels: ['Running', 'Swimming', 'Eating', 'Cycling',"Fucking"],
            datasets: [{
                label:'你',
                data: [100, 10, 4, 2,999],
                borderColor:'pink',
                pointHoverRadius:10

            }]
        }

    });
}
