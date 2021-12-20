import request from '../../common/axios'


//获取数据字典值
export function getDictParamsOfParentId(data) {
    const conf = {
        url: '/test/slaService',
        data,
    }
    return request(conf)
}

