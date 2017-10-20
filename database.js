const crypto = require('crypto');
const _ = require('lodash');

function divisible(hash, mod) {
    // We will read in 4 hex at a time, but the first chunk might be a bit smaller
    // So ABCDEFGHIJ should be chunked like  AB CDEF GHIJ
    var val = 0;

    var o = hash.length % 4;
    for (var i = o > 0 ? o - 4 : 0; i < hash.length; i += 4) {
        val = ((val << 16) + parseInt(hash.substring(i, i+4), 16)) % mod;
    }

    return val === 0;
}

// This will be the client seed of block 339300
const clientSeed = '000000000000000007a9a31ff7f07463d91af6b5454241d5faf282e5e0fe1b3a';

function genCrashAt(serverSeed) {
    let hash = crypto.createHmac('sha256', serverSeed).update(clientSeed).digest('hex');

    if (divisible(hash, 101))
        return 0;

    var h = parseInt(hash.slice(0,52/4),16);
    var e = Math.pow(2,52);

    return Math.floor((100 * e - h) / (e - h));
}

function genGameHash(serverSeed) {
    return crypto.createHash('sha256').update(serverSeed).digest('hex');
};

function beginSeed() {
    return 'e302c7f0419c88df837df4eee345cefb3c35520a49019e3d3494e8adcd0ad5b0';
}

function unitTest(count, callbacks) {
    let parallel = count;
    let serverSeed = beginSeed();

    _.range(parallel).map(function(){
        serverSeed = genGameHash(serverSeed);
        let at = genCrashAt(serverSeed);
        callbacks.map(c => c(at));
    });
};

exports.unitTest = unitTest;