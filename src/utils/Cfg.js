

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

};

module.exports = Cfg;
  
//export default Cfg;