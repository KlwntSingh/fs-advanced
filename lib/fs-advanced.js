/**
 * @author Kulwant
 *
 * Jun 13, 2015
 *
 */

"use strict";
var fs = require('fs');
var cbCaller = require("for-io").callbackCaller;

var fsutil = require("./fs-util.js");

var fsadvanced = function(options){
	var self = this;
	if(options){
		var logging = options.logging;
		if(logging == true){
			self.logging = options.logging;
		}else{
			self.logging = false;
		}
	}
}

/**
 * To copy asynchronously file executes callback
 * function when copy is finished.
 * 
 * TODO:: 
 * 	1. when destination directory is given than source file name should be used 
 * 
 */
fsadvanced.prototype.copyFile = function (source, destination, cb) {
	var self = this;
	
	
    var rd = fs.createReadStream(source),
        wt = fs.createWriteStream(destination);
    
    fsutil.log(self, "copying file from: " + source + " to " + destination);
    
    wt.on('close', function (err, data) {
    	if(err){
    		fsutil.log(self, err);    		
    	}
        if (cb !== undefined){
            cb(err, data);
        }
    });
    rd.pipe(wt);
};

/**
 * copy directory recursively to folder and takes the callback Function
 * 
 * TODO::
 *  1. when destination directory is nested and does not exists than to create them.
 *  
 */
fsadvanced.prototype.copydirR = function (source, destination, cb) {
	
	var self = this;
	
	var fn = function(){
		var parentdirL = source.split("/").length;
		var parentdir = source.split("/")[parentdirL - 1];
		fsutil.copydirRwithmovedirprop.call(self, source, destination + "/" + parentdir, cb);
	}
	
	fs.exists(destination, function (exists) {
        if (exists) {
        	fn();
    	}else{
    		fsutil.log(self, "making directory: " +destination);
    		fs.mkdir(destination, function (err) {
    			if(err){
    				fsutil.log(self, err);
    				return cb(err);
    			}
    			fn();
    		});        	    		
    	}
    });
};


/**
 * To move folder recursively async
 */
fsadvanced.prototype.movedirR = function (source, destination, cb) {
	
	var self = this;
	
    fs.exists(destination, function (exists) {
        if (exists) {
            destination = destination + " ( COPY )";
        }
        fsutil.copydirRwithmovedirprop.call(self, source, destination, function () {
            self.rmdirR(source, cb);
        });
    });
};

// This additional functin was made just to make sure that if i copy folder from source to destination with same name than folder will be same name with 
// attribute of copy



/**
 * To remove file async
 */
fsadvanced.prototype.rm = function (source, cb) {
	var self = this;
	
	fsutil.log(self, "removing file: " + source);
    fs.unlink(source, cb);
};

/**
 * To remove file Sync
 */
fsadvanced.prototype.rmSync = function (source) {
	
	var self = this;
	
	fsutil.log(self, "removing file: " + source);
    fs.unlinkSync(source);
};


/**
 * To remove dir
 */
fsadvanced.prototype.rmdir = function (source, cb) {
	var self = this;
	
	fsutil.log(self, "removing directory: " + source);
    fs.rmdir(source, cb);
};

/**
 * To remove folder Sync
 */
fsadvanced.prototype.rmdirSync = function (source) {
	var self = this;
	
	fsutil.log(self, "removing directory: " + source);
    fs.rmdirSync(source);
};


/**
 * To remove files and folders recursively and executes callback
 */
fsadvanced.prototype.rmdirR = function (source, cb) {

	var self = this;
	
    fs.exists(source, function (exists) {
        if (exists) {
        	fsutil.log(self, "reading directoring: " + source);
            fs.readdir(source, function (err, files) {
                if(err){
                	fsutil.log(self, err);
                	return cb(err);
                }
                var noOfFiles = files.length;
                var fn = cbCaller(noOfFiles, function(err){
                	if(err){
                		fsutil.log(self, err);
                	}
                	self.rmdir(source, function () {
                        return cb(err);
                    });
                });
                
                files.forEach(function (file, index) {
                    var curPath = source + "/" + file;
                    fs.lstat(curPath, function (error, stat) {
                        if (stat.isDirectory()) {
                            self.rmdirR(curPath, function (err) {
                            	fn(err)
                            });
                        }else {
                            self.rm(curPath, function (err) {
                            	fn(err)
                            });
                        }
                    })
                });
            });
        }
    })
};


/**
 * To remove only files from folders recursively and takes callback function
 */
fsadvanced.prototype.rmfilesR = function (source, cb) {

	var self = this;
	
    fs.exists(source, function (exists) {
        if (exists) {
            fsutil.log(self, "reading directory: " + source);
            fs.readdir(source, function (err, files) {
                var noOfFiles = files.length;
                
                var fn = cbCaller(noOfFiles, function(err){
                	if(err){
                		fsutil.log(self, err);
                	}
                	return cb(err);
                });
                
                files.forEach(function (file, index) {
                    var curPath = source + "/" + file;
                    fs.lstat(curPath, function (error, stat) {
                        if (stat.isDirectory()) {
                            self.rmfilesR(curPath, function (err) {
                            	fn(err);
                            });
                        }
                        else {
                            self.rm(curPath, function (err) {
                            	fn(err);
                            });
                        }
                    })
                });
            });
        }
    })
};


/**
 * To remove files and folders recursively Sync
 */
fsadvanced.prototype.rmdirSyncR = function (source) {
    
    var self = this;
    
    var files = [];
    if (fs.existsSync(source)) {
    	fsutil.log(self, "reading directory: " + source);
    	
        files = fs.readdirSync(source);
        files.forEach(function (file, index) {
            var curPath = source + "/" + file;
            if (fs.lstatSync(curPath).isDirectory()) { // recurse
                self.rmdirSyncR(curPath);
            } else { // delete file
                self.rmSync(curPath);
            }
        });
        self.rmdirSync(source);
    }

};


/**
 * To remove only files from folders recursively Sync
 */
fsadvanced.prototype.rmfilesSyncR = function (source) {
    var self = this;
    var files = [];
    if (fs.existsSync(source)) {
    	fsutil.log(self, "reading directory:" + source);
        files = fs.readdirSync(source);
        files.forEach(function (file, index) {
            var curPath = source + "/" + file;
            if (fs.lstatSync(curPath).isDirectory()) { // recurse
                self.rmfilesSyncR(curPath);
            } else { // delete file
                self.rmSync(curPath);
            }
        });
    }

};

fsadvanced.prototype.mkdir = function (source, cb) {
	var self = this;
	fsutil.log(self, "making directory: " + source);
	
    fs.mkdir(source, function () {
        cb();
    });
};

// Making Directory-Structure specified by json
fsadvanced.prototype.mkdirStructure = function (path, json) {
    if (!!json) mkdir(path + "/" + json.name, function () {
        json.dir.forEach(function (jso) {
            mkdirStructure(path + "/" + json.name, jso);
        });
    });
};

module.exports = fsadvanced;