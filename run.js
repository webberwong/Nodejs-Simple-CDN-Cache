#!/usr/local/bin/node
/**
 * 简单CDN文件缓存服务
 * 原理很简单,就是把网络静态资源缓存到本地硬盘,再提供服务
 * cdn-cache Chrome浏览器扩展地址 https://github.com/gbrunacci/cdn-cache
 * @author Hwl<weigewong@gmail.com>
 */
var express = require('express');
var crypto  = require('crypto');
var request = require('request');
var fs      = require('fs');
var ps      = require('process');
var path    = require('path');
//CDN-Cache的监听端口(目前是使用github里一个chrome扩展,暂不支持更换端口)
var PORT = 8890;
var app  = express();
var cacheFolder = ps.cwd() + '/cacheFolder';

//CDN-Cache判断是否在线,只需要返回200状态码
app.get('/is-alive',function(req,res){
	res.send('Alive');
});

//获取转发的全部http(s)的URL
app.get('/http*',function(req,res){
	
	//其实是CDN文件的源URL地址,CDN-Cache谷歌扩展发送的地址,会将地址encode,需要decode
	var fileName    = decodeURIComponent(req.url.substr(1));
	var extName     = path.extname(fileName);
	var fileMd5Name = md5(fileName);
	//创建缓存文件夹
	mkCacheFolder(cacheFolder);
	console.log('GET ' + fileName);

	var localCacheFileName = cacheFolder + '/' + fileMd5Name + extName;
	//如果已经缓存到本地,则使用本地的文件
	if(fs.existsSync(localCacheFileName)){
		console.log('hits => ' + localCacheFileName);
		res.sendFile(localCacheFileName);
	}else{
		request(fileName, function (error, response, body) {
			if(error){
				res.sendStatus(500);
			}else if(!error && response.statusCode == 200) {
				fs.writeFileSync(localCacheFileName,body);
				console.log('make => ' + localCacheFileName);
			    res.sendFile(localCacheFileName);
			}else{
				var statusCode = response.statusCode || 500;
				console.log('cache failure');		
				res.status(statusCode).send('Can not cached it');			
			}
		})
	}
});


app.listen(PORT);

/**
 * 创建缓存文件夹
 * 如果存在则不创建
 */
function mkCacheFolder($path){
	if(!fs.existsSync($path)){
		fs.mkdirSync($path);
	}
}
/**
 * md5加密
 */
function md5(text){
	var _md5 = crypto.createHash('md5');
	_md5.update(text);
    return _md5.digest('hex');
}