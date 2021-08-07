
# 之前只用babel打包，但是引入的helper函数或者扩展api实在babel内部插件中，所以这里使用webpack将相关方法拉出来，使打包后的js插入到html中运行
# [参考教程](https://zhuanlan.zhihu.com/p/147083132)

## @babel/core, @babel/cli
```
 CLI 命令行工具，可通过命令行编译文件，想要再命令窗口执行 babel src --out-dir dist 等命令就需要安装这两个包
```

## @babel/preset-env
```
 配置了这个才能转化语法，将es6转换位es5，首先写一个最简单的 babel 配置文件
 {
   "presets":[["@babel/preset-env"]]
 }
 
 但是 api 并没有做任何处理
 
useBuiltIns属性主要有三个值:usage|entry| false,默认是false
	false:不自动引入polyfills,也不会转换import "core-js"和import "@babel/polyfill"引用为单独的polyfill。
	entry:处理在项目入口的引入。注意整个应用(bundle)只能使用一次import "core-js和import "regenerator-runtime/runtime"。如果多次引入会报错。推荐创建一个只包含import声明的单入口文件。
		理论上useBuiltIns:'entry'这种由入口文件一股脑把所有pollfill全部引入的方式是不推荐的
	usage:在文件需要的位置单独按需引入,可以保证在每个bundler中只引入一份。
		这种按需引入应该是最优的处理方式,但是不会处理第三方依赖包的引入模块,所以如果第三方依赖包使用了高级语法而未处理兼容性的话,可能会出bug。
```
## @babel/polyfill
```
全局引入！！！会污染全局变量,在babel7.4中废弃了，改为使用 @babel/plugin-transform-runtime
 babel-polyfill 的作用是兼容新的API。扩展全局函数，比如(比如promise, Array.from)等---一般全局引入，但是会污染全局环境
```
## 细节讨论
```
{
  "presets": [
    [
      "@babel/preset-env",
      {
             "useBuiltIns": "usage",
             "debug": true
      }
    ]
  ]
}
这种配置有两个问题：
	1.虽然使用usage现在是按需加载了，并不是全部都引入，但是会修改全局的依赖【比如 find函数直接在原型上修改，这可能会导致第三方依赖包有bug(可能三方依赖也更改了这个方法，你改了人家就跑不动了)】
	2.helpers 函数会有重复的情况【babel自定义了很多辅助函数，存在这个问题，若文件过多那么这些相同的函数会在多个文件重复出现】
              ||
			  || 升级
			  \/
@babel/plugin-transform-runtime 这个插件的作用就是解决上面提到的两个问题
其中 @babel/plugin-transform-runtime 的作用是转译代码，转译后的代码中可能会引入 @babel/runtime-corejs3 里面的模块。
所以前者运行在编译时，后者运行在运行时。类似 polyfill，后者需要被打包到最终产物里在浏览器中运行。

在引入了 transform-runtime 这个插件后：
	1.api 从之前的直接修改原型改为了从一个统一的模块中引入，避免了对全局变量及其原型的污染，解决了第一个问题
	2.helpers 从之前的原地定义改为了从一个统一的模块中引入，使得打包的结果中每个 helper 只会存在一个，解决了第二个问题
```
## 最终选择方案
```
安装的依赖有：@babel/preset-env, @babel/plugin-transform-runtime, @babel/runtime-corejs3,core-js@3
其中core-js结合webpack在打包时 “使用新的API的最重要的包” 
配置文件如下：
{
  "presets": [
    [
      "@babel/preset-env",
      {
        "useBuiltIns": "usage",
        "debug": true
      }
    ]
  ],
  "plugins": [
    [
      "@babel/plugin-transform-runtime",
      {
        "corejs": 3 // 指定 runtime-corejs 的版本，目前有 2 3 两个版本
      }
    ]
  ]
}

有点教程说到
其中 @babel/plugin-transform-runtime 是编译时使用的，安装为开发依赖，而 @babel/runtime 其实就是 helper 函数的集合，需要被引入到编译后代码中，所以安装为生产依赖，
但是安装了runtime-corejs3后就不用再安装 @babel/runtime 了
总结：
babel 在转译的过程中，对 syntax 的处理可能会使用到 helper 函数，对 api 的处理会引入 polyfill。

默认情况下，babel 在每个需要使用 helper 的地方都会定义一个 helper，导致最终的产物里有大量重复的 helper；引入 polyfill 时会直接修改全局变量及其原型，造成原型污染。

@babel/plugin-transform-runtime 的作用是将 helper 和 polyfill 都改为从一个统一的地方引入，并且引入的对象和全局变量是完全隔离的，这样解决了上面的两个问题。
```