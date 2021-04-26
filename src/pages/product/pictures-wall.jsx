import React from 'react'
import PropTypes from 'prop-types'
import { Upload, Modal, message } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { reqDeleteImg } from '../../api'
import { BASE_IMG_URL } from '../../utils/constants'

function getBase64(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = error => reject(error);
    });
}

export default class PicturesWall extends React.Component {

    static propTypes = {
        imgs: PropTypes.array,
    }
    constructor(props) {
        super(props)

        let fileList = []

        // 如果传入了imgs属性
        const { imgs } = this.props
        if (imgs && imgs.length > 0) {
            fileList = imgs.map((img, index) => ({
                uid: -index, /* 每个file都有自己唯一的id */
                name: img,/* 图片的文件名 */
                status: 'done',/* 图片状态，done、uploading、error、removed已删除 */
                url: BASE_IMG_URL + img,
            }))
        }


        // 初始化状态
        this.state = {
            previewVisible: false, //标识是否显示大图预览Modal
            previewImage: '',
            previewTitle: '',
            fileList
        }
    }


    /*  
    这个就相当于写成this.state = {},但是这个和constructor的优先级呢，
    个人理解是构造器优先，也会覆盖？
    */

    state = {
        previewVisible: false, //标识是否显示大图预览Modal
        previewImage: '',
        previewTitle: '',
        fileList: [//#region 
            // {
            //     uid: '-1', /* 每个file都有自己唯一的id */
            //     name: 'image.png',/* 图片的文件名 */
            //     status: 'done',/* 图片状态，done、uploading、error、removed已删除 */
            //     url: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png',
            // },
            // {
            //     uid: '-2',
            //     name: 'image.png',
            //     status: 'done',
            //     url: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png',
            // },
            // {
            //     uid: '-xxx',
            //     percent: 50,
            //     name: 'image.png',
            //     status: 'uploading',
            //     url: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png',
            // },
            // {
            //     uid: '-5',
            //     name: 'image.png',
            //     status: 'error',
            // },
            //#endregion
        ],
    };

    handleCancel = () => this.setState({ previewVisible: false });

    handlePreview = async file => {
        if (!file.url && !file.preview) {
            file.preview = await getBase64(file.originFileObj);
        }

        this.setState({
            previewImage: file.url || file.preview,
            previewVisible: true,
            previewTitle: file.name || file.url.substring(file.url.lastIndexOf('/') + 1),
        });
    };

    handleChange = async ({ file, fileList }) => {

        // 一旦上传成功，将当前上传的file的信息进行修正（name，url）
        if (file.status === 'done') {
            const result = file.response //{status:0,{name:'xxx.jpg',url:'地址'}}
            if (result.status === 0) {
                message.success('图片上传成功')
                const { name, url } = result.data
                file = fileList[fileList.length - 1]
                file.name = name
                file.url = url

            } else {
                message.error('图片上传失败')
            }
        } else if (file.status === 'removed') {//删除图片

            const result = await reqDeleteImg(file.name)
            if (result.status === 0) {
                message.success('图片删除成功')
            } else {
                message.error('图片删除失败')
            }
        }


        this.setState({ fileList })
    };

    /* 获取所有已上传图片文件名的数组 */
    getImgs = () => {
        return this.state.fileList.map(file => file.name)
    }

    render() {
        const { previewVisible, previewImage, fileList, previewTitle } = this.state;
        const uploadButton = (
            <div>
                <PlusOutlined />
                <div style={{ marginTop: 8 }}>Upload</div>
            </div>
        );
        return (
            <>
                <Upload
                    action="/manage/img/upload" //上传图片的接口地址
                    accept='image/*'  //只接收图片格式
                    name='image' /* 请求参数名 */
                    listType="picture-card"
                    fileList={fileList} /* 所以已经上传的文件列表 */
                    onPreview={this.handlePreview}
                    onChange={this.handleChange}
                >
                    {fileList.length >= 8 ? null : uploadButton}
                </Upload>
                <Modal
                    visible={previewVisible}
                    title={previewTitle}
                    footer={null}
                    onCancel={this.handleCancel}
                >
                    <img alt="example" style={{ width: '100%' }} src={previewImage} />
                </Modal>
            </>
        );
    }
}


