// 测试babel语法转换
let myfn = (arg = '123') => {
	console.log(arg, 11)
}
myfn();

// 测试babel 对新api方法的处理
let findItem = [1, 2, 3, 4].find(item => item === 2)
console.log(findItem, 22)

// promise 测试
let fFn = () => {
	return new Promise((resolve, reject) => {
		try {
			setTimeout(() => {
				resolve({
					data: '返回成功',
					success: true
				})
			}, 1000)
		} catch (e) {
			reject({
				data: '返回失败',
				success: false
			})
		}
	})
}
fFn().then((res) => {
	console.log(res, 33)
}).catch((e) => {
	console.log(e, 44)
}).finally(() => {
	console.log(55)
})
