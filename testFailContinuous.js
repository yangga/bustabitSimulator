var db = require('./database');
const _ = require('lodash');

let cnt = 0, maxCnt = 0, mapCnt = {};

function finalize() {
    if (cnt > 0) {
        if (mapCnt[cnt]) {
            mapCnt[cnt]++;
        } else {
            mapCnt[cnt] = 1;
        }

        maxCnt = Math.max(maxCnt, cnt);
    }
    
    cnt = 0;
}

const callbacks = [
    // function(at){
    //     console.log(at*0.01);
    // },
    function(at){
        if (at < crashTarget) {
            cnt++;
        } else {
            finalize();
        }
    },
]

const fnAnalysis = [
    function(){
        console.log('maxCnt - ' + maxCnt);

        _.forOwn(mapCnt, (value, key) => {
            console.log('cnt['+key+'] - ' + value + ' times');
        });
    }
]

let loopCount = process.argv[2];
let crashTargetInput = process.argv[3];
let crashTarget = crashTargetInput * 100;
console.log('loop count - ' + loopCount);
console.log('crashTarget - ' + crashTargetInput);

db.unitTest(loopCount, callbacks);
finalize();
fnAnalysis.map(f => f());
