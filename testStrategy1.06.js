var db = require('./database');
const _ = require('lodash');

const startBudget = 200000.00;
const crashTarget = 106;  // 1.06
const betBits = 1000;

let myBudget = startBudget;

const callbacks = [
    // function(at){
    //     console.log(at*0.01);
    // },
    function(at){
        if (at < crashTarget) {
            myBudget -= betBits;
        } else {
            myBudget += (betBits * ((crashTarget-100)*0.01));
        }
    },
]

const fnAnalysis = [
    function(){
        console.log('left budget:' + myBudget + ', NetProfit:' + (myBudget-startBudget));
    }
]

let loopCount = process.argv[2];
console.log('loop count - ' + loopCount);

db.unitTest(loopCount, callbacks);

fnAnalysis.map(f => f());
