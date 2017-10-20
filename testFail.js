var db = require('./database');

let atList = [];
const callbacks = [
    // function(at){
    //     console.log(at*0.01);
    // },
    function(at){
        atList.push(at);
    },
]

function crashAtAnalysis(target) {
    let cnt = 0;
    atList.forEach(at => {
        if (at < target) cnt++;
    });
    console.log('cnt that lesser than ' + (target*0.01).toFixed(2) + ' - ' + cnt + ', ' + (cnt/loopCount*100.0).toFixed(4) + ' %');
}

const fnAnalysis = [
    function(){
        for (i=100; i<=200; i+=1) {
            crashAtAnalysis(i);
        }
    }
]

let loopCount = process.argv[2];
console.log('loop count - ' + loopCount);
db.unitTest(loopCount, callbacks);

fnAnalysis.map(f => f());
