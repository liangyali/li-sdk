# Getting Started

安装: `npm install li-sdk --save`

```js
var SDK = require('li-sdk');
var client=new SDK(settings,routes);
```

## Documentation

###构造函数 SDK(options, routes)
####options

```js
{
	baseUrl:'http://127.0.0.1',
	apiKey:'',
	//other config
}
```

参数 | 说明 | 是否必填
------------ | ------------- | ------------
baseUrl | api基础地址   | 必填

#####routes

```js
var routes={
	"user.get":{
		method:'GET'，
		uri:'/user/get/:id'
	}
};
```

参数 | 说明 | 是否必填
------------ | ------------- | ------------
method | 接口Method   | 否 （默认'GET'）
uri | 接口地址   | 否 （默认'GET'）

###方法
####use
#####说明：设置中间件

```js
sdk.use(function(options,done){
	//TODO set options
	done(null,options);
});
```
#####options参数说明
参数 | 说明 | 是否必填
------------ | ------------- | ------------
method | 接口Method   | 否 （默认'GET'）
uri | 接口地址   | 否 （默认'GET'）


### Events
 
#### on('before',function(error,options){})
 说明：所有请求前事件

参数 | 说明 |
------------ | ------------- 
params | 接口调用参数 
requestOptions | request请求配置，请参考request module option 选项
apiName | 请求方法名

#### on('{apiName}:before',function(error,options){})
 说明：某个方法之前的事件

参数 | 说明 |
------------ | ------------- 
params | 接口调用参数 
requestOptions | request请求配置，请参考request module option 选项
apiName | 请求方法名


####on('before',function(error,body){})

参数 | 说明 |
------------ | ------------- 
params | 接口调用参数 
requestOptions | request请求配置，请参考request module option 选项
apiName | 请求方法名

####on('{apiName}:before',function(error,body){})

参数 | 说明 |
------------ | ------------- 
params | 接口调用参数 
requestOptions | request请求配置，请参考request module option 选项
apiName | 请求方法名

###example
> ```js
   sdk.on('before', function (error, options) {
    	
    	
   });
	
	//options
	//{
	//    params:{},
	//    requestOptions:{},
	//    apiName:''	
	//}
	
	sdk.on('user.get:before', function (error, options) {
    	
    	
	});
	
	//options
	//{
	//    params:{},
	//    requestOptions:{},
	//    apiName:''	
	//}
	
	sdk.on('after', function (error, body) {
    	//api result to body
    	
	});
	
	sdk.on('user.get:after', function (error, body) {
    	//api result to body
    	
	});
	
	sdk.on(’error‘,function(error){
		//TODO log error
	});	
   
```