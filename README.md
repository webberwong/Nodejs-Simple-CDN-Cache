简单CDN文件缓存服务
=======================
网站开发,为了上线的时候可以直接使用CDN的资源,而不必再去修改代码或者是使用工具生成部署代码,所以在开发代码上直接使用CDN的资源链接;<br>
但在有时断网的环境下,CDN文件全部不能访问,要再修改就麻烦;<br>
所以想找可以缓存一些静态的CDN资源文件在本地,以方便在断网的时候使用;<br>

### 扩展里的插件 cdn-cache
在谷歌扩展里刚好找到符合该需要的插件,马上添加到扩展<br>
服务端需要python <br>
Github地址: [CDN-cache](https://github.com/gbrunacci/cdn-cache)<br>
先将网站的CDN资源访问一下,以缓存在本地,这样,没网的时候照样继续码<br>
使用后,感觉不错,就是该插件只能是加速cdn的资源(缓存到本地),但不能在断网使用<br>


### 替换原插件的服务端,使插件能在缓存后断网正常使用
简单分析下该插件的源码<br>
```
关键的参数
转发到本地的 8890 端口
可用检测地址: /is-alive 检测状态码200
转发规则: 静态资源的地址URLEncode
```
根据上面的信息,用node写了一个缓存服务器,监听端口8890,用来代替原插件的服务端<br>
**测试环境:node v4.2.4**

### 安装
首先安装node,npm(此处略10000字...) <br>
安装依赖
```
# express@4
npm install express
npm install request

```
### 使用
```
node run.js
```
### 缓存
缓存的文件夹默认在 代码根目录/cacheFolder,确保运行node的用户有rw权限<br>
**如何删除缓存?**<br>
没有提供该功能^_^,本来cdn资源就是要强缓存的. <br>
*删除全部缓存* <br>
```
#直接将缓存文件夹整个删除即可
rm -rf 代码根目录/cacheFolder

```
*删除个别缓存*<br>
可以从输出的日志找到某个文件生成的缓存文件地址,并删除
```
#输出日志信息
GET http://libs.baidu.com/jquery/2.1.1/jquery.js
hits => /Users/hwl/Practices/Nodejs-Project/CDN-Cache/cacheFolder/4e938d4cb94d964a7731166a8c3486a1.js
```