/**
 * @author Kulwant
 * 
 * Sep 3, 2016
 */


"use strict";

var fs = require("fs");
var cbCaller = require("for-io").callbackCaller;

var copydirRwithmovedirprop = function (source, destination, cb) {

	var self = this;
	
	log(self, "reading directory: " + source);
    fs.readdir(source, function (err, files) {
    	if(err){
    		log(self, err);
    		return cb(err);
    	}
    	log(self, "making directory: " + destination);
        fs.mkdir(destination, function (err) {
        	
        	if(err){
        		log(self, err);
        		return cb(err);
        	}
        	
            var noOfFiles = files.length;
            
            var fn = cbCaller(noOfFiles, function(err, data){
            	if(err){
            		log(self, err);
            	}
            	cb(err);
            });
            
            files.forEach(function (file, index) {
                var curPath = source + "/" + file;
                var destPath = destination + "/" + file;
                fs.lstat(curPath, function (error, stat) {
                    if (stat.isDirectory()) {
                        copydirRwithmovedirprop.call(self, curPath, destPath, function (err, data) {
                        		return fn(err);
                        });
                    }
                    else {
                        self.copyFile(curPath, destPath, function (err) {
                        	fn(err);
                        });
                    }
                })
            });
        });
    });
    
};

var log = function(self, msg){
	self.logging ? console.log(msg) : false;
}

module.exports = {
		copydirRwithmovedirprop : copydirRwithmovedirprop,
		log : log
}