import {
    AppstoreOutlined,
    HomeOutlined,
    BarsOutlined,
    ToolOutlined,
    UserOutlined,
    SafetyCertificateOutlined,
    AreaChartOutlined,
    BarChartOutlined,
    LineChartOutlined,
    PieChartOutlined
} from '@ant-design/icons';



const menuList = [
    {
        title: '首页',
        key: '/home',
        icon: <HomeOutlined/>,
        isPublic:true,//公开的权限
    },
    {
        title: '商品',
        key: '/products',
        icon: <AppstoreOutlined/>,
        children: [
            {
                title: '品类管理',
                key: '/category',
                icon: <BarsOutlined/>
            },
            {
                title: '商品管理',
                key: '/product',
                icon: <ToolOutlined/>
            },
        ]
    },
    {
        title: '用户管理',
        key: '/user',
        icon: <UserOutlined/>
    },
    {
        title: '角色管理',
        key: '/role',
        icon: <SafetyCertificateOutlined/>,
    },
    {
        title: '图形图表',
        key: '/charts',
        icon: <AreaChartOutlined/>,
        children: [
            {
                title: '柱形图',
                key: '/charts/bar',
                icon: <BarChartOutlined/>
            },
            {
                title: '折线图',
                key: '/charts/line',
                icon: <LineChartOutlined/>
            },
            {
                title: '饼图',
                key: '/charts/pie',
                icon: <PieChartOutlined/>
            },
        ]
    },
]

export default menuList