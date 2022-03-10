// import "core-js"
// import "regenerator-runtime/runtime"

console.log('-- es5+语法转换，如箭头函数，let，const, class等 --')
let myArr = [1, 2, 3]
const fn = ()=>{
    console.log('箭头函数',myArr)
}
fn()
class Animal{
    constructor(name){
        this.name = name
    }
    sayName(){
        console.log('我的名字是:'+ this.name)
    }
}
var cat = new Animal('小猫')
cat.sayName()


console.log('-------新增的api,如 Promise，Array.from-------')
new Promise((resolve,reject)=>{
        resolve({data:'Promise 返回值'})
}).then(res=>{
    console.log(res.data)
})
console.log(Array.from('foo'));


console.log('-------实例属性，如[].includes, string.repeat-------')
console.log([1,2,3].includes(3))
console.log("abc".repeat(3))