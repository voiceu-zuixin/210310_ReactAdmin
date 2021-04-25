const { override, fixBabelImports, addLessLoader } = require('customize-cra');

module.exports = override(
    //针对antd实现按需打包，根据import的具体内容组件进行打包
    // 使用babel-plugin-import进行
    fixBabelImports('import', {
        libraryName: 'antd',//包的名字
        libraryDirectory: 'es',
        style: true,//自动打包相关样式
    }),
    addLessLoader({
        lessOptions: {
            javascriptEnabled: true,
            modifyVars: {
                '@primary-color': 'rgb(56, 161, 117)'
            },
        }
    }),
);

