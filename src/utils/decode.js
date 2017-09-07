
var CRC = require("crc");
var PAKO = require("pako");


function bin2json(data) {
    const strData = new Buffer(data, 'base64').toString('binary');
    const charData = strData.split('').map(function(x){return x.charCodeAt(0);});
    const binData = new Uint8Array(charData);
    const dbinData = PAKO.inflate(binData);
    const strRes = String.fromCharCode.apply(null, new Uint16Array(dbinData));
    return JSON.parse(strRes);
}

function decode_card(s) {
    if (s.match(/^TS\*/)) {
        const els = s.split("\*");
        if (els.length != 7) {
            return null;
        }
        const ref_gid = els[1];
        const data = els[2];
        const crc = els[4];

        const c = CRC.crc32(data+"*"+els[0]);
        if (crc != c) {
            return null;
        }
        var rs = bin2json(data);
        if (rs.id != ref_gid) {
            return null;
        }
        rs['action'] = els[0];
        return rs;
    } else if (s.match(/^TS_CMD\*/)) {
        console.log("cmd card");
        const els = s.split("\*");
        if (els.length != 5) {
            console.log("wrong format")
            return null;
        }
    
        const data = els[1];
        const crc = els[2];
        const c = CRC.crc32(data+"*"+els[0]);
        if (crc != c) {
            return null;
        }
        var rs = bin2json(data);     
        rs['action'] = els[0];
        return rs;
    } 
    return null;
}




/*
const test = "TS*69626*eJyrVipLLVKyUgoJNlTSUcpMUbIyszQzMtNRKk5NLM7PA8oYGRia6xtaAGWT80uLilOBQiCleYm5IKZLYhlQE1B5aRFUJKbUwNDMoAREGSYVACmDVMM8kIrUCqBsrlItACfLIG4=*2933823073*302954397**";
const test2 = "TS_CMD*eJyrVipLLVKyUgoJNlTSUcpMATKd44NdQ0IDgNzk/NKi4tR4sGhiekFVWl5QlU9EQUaye05Vcoavj2t6lEuScVhlslFoZLqns6NRQKpLZnq+L0Jrcn5KKlCzIUIkLzEXJFIVU2pgkGqYnZOYkgdmpigUlwAZhqaWqSn5IIaZYXZ+TnE2WNJSoSQxLxUkagBTrlQLABFlPOY=*3846057001**"

console.log(decode_card(test));
console.log("==")
console.log(decode_card(test2));
*/

export default decode_card;