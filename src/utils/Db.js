

var Cfg = require("./Cfg");
var cfg = new Cfg();

const pMap = require('p-map');
const pAll = require('p-all');
const pSeries = require('p-series');
const pThrottle = require('p-throttle');

const isEqual = require('lodash').isEqual

var axios = require('axios');

var remote_api = axios.create({
  baseURL: cfg.remote_api_url,
  timeout: 5000,
  headers: {'x-remoteapi-secret': cfg.remote_api_secret}
});


var Datastore = require('nedb');

var seasons_db = new Datastore({ filename: 'seasons.db', autoload: true });
var folders_db = new Datastore({ filename: 'folders.db', autoload: true });
var courses_db = new Datastore({ filename: 'courses.db', autoload: true });
var students_db = new Datastore({ filename: 'students.db', autoload: true });



function fixId(obj) {
    var copy = Object.assign({}, obj);
    copy["_id"] = copy.id;
    delete copy["id"]
    return copy;
}
function getId(obj) {
    return obj._id;
}

function insertOrUpdate(db,doc) {
    return new Promise(function(resolve,reject){
        db.findOne({ _id: doc._id },function (err, olddoc) {
            if (err) {
                reject(err);
            } else {
                if (olddoc) {
                    if (isEqual(doc,olddoc)) {
                        resolve("equal");
                    } else {
                        db.update({ _id: doc._id },doc,function (err, numAffected) {
                            if (err) {
                                reject(err);
                            } else {
                                resolve("update");
                            }
                        });
                    }
                } else {
                    db.insert(doc,function (err, newDoc) {
                        if (err) {
                            reject(err);
                        } else {
                            resolve("new");
                        }
                    });
                }
            }
        });
    });
}





function updateSeasons() {
    console.log("updateSeasons")
    return new Promise(function(resolve,reject){
        remote_api.get("/seasons").then(res=>{
            pMap(res.data.seasons.map(fixId),(x)=>insertOrUpdate(seasons_db,x),{concurency:1}).then(r=>{resolve("ok")}).catch(reject);
        }).catch(reject)
    });     
}

function updateFolders() {
    console.log("updateFolders")
    return new Promise(function(resolve,reject){
        remote_api.get("/folders").then(res=>{
            pMap(res.data.folders.map(fixId),(x)=>insertOrUpdate(folders_db,x),{concurency:1}).then(r=>{resolve("ok")}).catch(reject);
        }).catch(reject)
    });     
}


function getActiveSeasons() {
    return new Promise(function(resolve,reject){
        seasons_db.find({access_check:true}).sort({ order_value: 1 }).exec(function (err, docs) {
            if (err) {
                reject(err);
            } else {
                resolve(docs);
            }
        });
    });
}

function getActiveFolders() {
    return new Promise(function(resolve,reject){
        folders_db.find({access_check:true}).sort({ order_value: 1 }).exec(function (err, docs) {
            if (err) {
                reject(err);
            } else {
                resolve(docs);
            }
        });
    });
}


function updateCourses(season,folder) {
    console.log("updateCourses season", season._id,season.name, "folder", folder._id, folder.name)
    return new Promise(function(resolve,reject){
        remote_api.get("/courses/"+season._id+"/"+folder._id).then(res=>{
            pMap(res.data.courses.map(fixId),(x)=>insertOrUpdate(courses_db,x),{concurency:1}).then(r=>{resolve("ok")}).catch(reject);
        })        
    });
}

function updateStudents(course) {
    return new Promise(function(resolve,reject){
        console.log("fetch students ",course._id,course.name)
        remote_api.get("/students/"+course._id).then(res=>{
            pMap(res.data.students.map(fixId),(x)=>insertOrUpdate(students_db,x),{concurency:1}).then(r=>{resolve("ok")}).catch(reject);
        })         
    });
}

const updateStudentsThrottled = pThrottle(updateStudents, 1, 1000);

function updateAllStudentsAndDeleteOld() {
    return new Promise(function(resolve,reject){
        courses_db.find({},function(err,docs){
            pMap(docs,updateStudentsThrottled,{concurency:1}).then(r=>{
                var cids = docs.map(getId);    
                students_db.remove({course_key: {$nin: cids}},{multi:true},function (err, numRemoved){
                    if (err) {
                        reject(err);
                    } else {
                        console.log(numRemoved);
                        resolve("ok");
                    }
                });
            })
        });
    });
}

//updateAllStudents().then(console.log)

function getActivePairs() {
    return new Promise(function(resolve,reject){
        pAll([getActiveFolders,getActiveSeasons],{concurency:1}).then(data=>{
            var pairs = []
            for (var s of data[1]) {
                for (var f of data[0]) {
                    pairs.push({folder:f,season:s});
                }
            }
            resolve({pairs:pairs,folders:data[0],seasons:data[1]});
        }).catch(reject);
    });
}

function updateCoursesAndDeleteOld() {
    return new Promise(function(resolve,reject){
        getActivePairs().then(data=>{
            pMap(data.pairs,(p)=>updateCourses(p.season,p.folder),{concurency:1}).then(r=>{
                var fids = data.folders.map(getId);
                var sids = data.seasons.map(getId);
                courses_db.remove({ $or:[{season_key: {$nin: sids}}, {folder_key: {$nin: fids}}]}, { multi: true },function (err, numRemoved) {
                    if (err) {
                        reject(err);
                    } else {
                        resolve("ok");
                    }
                });
            }).catch(reject);

        }).catch(reject);
    });
}



function completeUpdate() {
    return new Promise(function(resolve,reject){
        pSeries([updateSeasons,updateFolders,updateCoursesAndDeleteOld,updateAllStudentsAndDeleteOld]).then(r=>{
            resolve(true);
        }).catch(reject);
    }); 
}


function startSync(){
    console.log("db sync start");
    completeUpdate().then(console.log).catch(console.error);    
}
function stopSync(){
    console.log("db sync stop");   
}

function findRefGid(ref_gid,callback) {
    console.log("db looking for ref_gid",ref_gid);
    students_db.findOne({ ref_gid: ref_gid },function (err, doc) {
        if (err) {
            console.log("find err",err);
            callback(null);
        } else {
            console.log("found");
            callback(doc);    
        }
    });
}

function getCoursesTree(callback) {
    var tree = [];
    getActivePairs().then((d)=>{
        pMap(d.pairs,(p)=>{
            return new Promise(function(resolve,reject){
                courses_db.find({folder_key:p.folder._id, season_key:p.season._id}).exec(function (err, docs){
                    if (err) {
                        reject(err);
                    } else {
                        p["courses"] = docs;
                        resolve(p);
                    }
                });
            });
        }).then(callback).catch(callback(null));
    
       
    }).catch(callback(null));
}

module.exports = {
    startSync:startSync,
    stopSync:stopSync,
    findRefGid: findRefGid,
    getCoursesTree: getCoursesTree
}
  