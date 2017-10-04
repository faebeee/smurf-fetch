"use strict";

let logs = [];
module.exports = {
    getLogs(){
        return logs
    },

    reset(){
        logs = []
    },

    log(data){
        logs.push(data);
    }
};