import { request } from '../../utils/request'
import { cbParams } from './interface'

export const postDocusignCallback = (params: cbParams) => {
  return request({
    url: '/docusign/callback',
    method: 'get',
    data: {},
    params: params
  })
}
