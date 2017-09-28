

class Cfg {
    constructor(scope=null) {
        this.scope = scope;
    }
    setItem(key,value) {
        localStorage.setItem(key,value);
    }
    getItem(key,def=null) {
        var v = localStorage.getItem(key);
        return (v != null)? v:def;
    }

    setBool(key,value) {
        this.setItem(key,value?"on":"off");
    }
    getBool(key,def=false) {
        return (this.getItem(key,"off") === "on");
    }

    get station_name() {
        return this.getItem("station_name","default station");
    }
    set station_name(val) {
        this.setItem("station_name",val);
    }

    get remote_api_url() {
        return this.getItem("remote_api_url","http://localhost:3000/remote_api");
    }
    set remote_api_url(val) {
        this.setItem("remote_api_url",val);
    }

    get remote_api_secret() {
        return this.getItem("remote_api_secret","supermariocat");
    }
    set remote_api_secret(val) {
        this.setItem("remote_api_secret",val);
    }

    get full_screen() {
        return this.getBool("full_screen");
    }
    set full_screen(val) {
        this.setBool("full_screen",val);
    }

    get startup_sync() {
        return this.getBool("startup_sync");
    }
    set startup_sync(val) {
        this.setBool("startup_sync",val);
    }

    get debug() {
        return this.getBool("debug");
    }
    set debug(val) {
        this.setBool("debug",val);
    }

    get last_sync() {
        return new Date(this.getItem("last_sync",0));
    }

    set last_sync(date) {
        this.setItem("last_sync",date);
    }
};

module.exports = Cfg;
  
//export default Cfg;