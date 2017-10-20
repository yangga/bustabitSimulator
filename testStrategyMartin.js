var db = require('./database');
const _ = require('lodash');

const startBudget = 200000.00;

let myBudget = startBudget;
let lastBetBits = 0;

function resetBet() {
    lastBetBits = betBits;
}

function martinBet() {
    lastBetBits *= martin;    
}

const callbacks = [
    // function(at){
    //     console.log(at*0.01);
    // },
    function(at){
        if (at < crashTarget) {
            myBudget -= lastBetBits;
            //console.log('lose - budge:' + myBudget + ', bet:'+lastBetBits);
            martinBet();
            if (myBudget < lastBetBits) {
                resetBet();
            }
        } else {
            myBudget += (lastBetBits * ((crashTarget-100)*0.01));
            //console.log('lose - budge:' + myBudget + ', bet:'+lastBetBits);
            resetBet();
        }
    },
]

const fnAnalysis = [
    function(){
        console.log('left budget:' + myBudget + ', NetProfit:' + (myBudget-startBudget));
    }
]

const loopCount = process.argv[2];
const crashTargetInput = process.argv[3];
const crashTarget = crashTargetInput * 100;
const martin = process.argv[4];
const betBits = process.argv[5];
console.log('loop count - ' + loopCount);
console.log('crashTarget - ' + crashTargetInput);
console.log('martin - ' + martin);
console.log('betBits - ' + betBits);

resetBet();

db.unitTest(loopCount, callbacks);

fnAnalysis.map(f => f());
