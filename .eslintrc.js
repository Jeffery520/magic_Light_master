/*global module*/
/*eslint no-undef: "error"*/
module.exports = {
	globals: {
		swan: 'readonly',
		wx: 'readonly',
		uni: 'readonly',
		process: true
	},
	extends: ['eslint:recommended', 'plugin:vue/recommended', '@vue/prettier'],
	parserOptions: {
		ecmaVersion: 2020,
		sourceType: 'module'
	},
	plugins: ['vue'],
	rules: {
		'prettier/prettier': 'error',
		// 自己写一些想配置的规则
		'no-console': 'off', // 生产环境禁用consele
		'no-debugger': 'warn', // 生产环境禁用debugger
		'no-param-reassign': ['error', { props: false }], // 允许修改参数中的属性值
		'func-names': 'off', // 允许使用匿名函数
		'no-plusplus': 'off', // 一元运算符
		'no-restricted-syntax': 'off', // 不限制语法
		'consistent-return': 'off',
		'no-shadow': 'off',
		'no-underscore-dangle': 'off',
		'no-restricted-globals': 'off',
		'no-use-before-define': 'off' // 允许定义之前使用
		// "linebreak-style": "off", // 忽略检测换行风格
		// 'vue/max-attributes-per-line': 'off', // 关闭强制 html 标签换行
		// 'prefer-destructuring': ['error', { object: true, array: false }], // 允许数组通过下标取值
		// 'max-len': 'off', // 对象选项
		// 'no-shadow': ['error', { allow: ['state'] }], // 允许对其进行阴影处理
		// 'import/prefer-default-export': 'off', // 模块只输出一个变量时，是否需要添加default
	},
	overrides: [
		{
			files: ['*.vue'],
			rules: {
				// 这里写覆盖vue文件的规则
			}
		}
	],
	env: {
		node: true // 只需将该项设置为 true 即可
	}
};
