import request from '@/utils/request'

export function queryTenant(data) {
  return request({
    url: '/organization/tenant/conditions',
    method: 'post',
    data
  })
}

export function queryTenantAll() {
  return request({
    url: '/organization/tenant/all',
    method: 'post',
  })
}

export function getUserMsg(id) {
  return request({
    url: '/organization/tenant/user' + id,
    method: 'get'
  })
}

export function getTenant(id) {
  return request({
    url: '/organization/tenant/' + id,
    method: 'get'
  })
}

export function createTenant(data) {
  return request({
    url: '/organization/tenant',
    method: 'post',
    data
  })
}

export function updateTenant(data) {
  return request({
    url: '/organization/tenant/' + data.id,
    method: 'put',
    data
  })
}

export function deleteTenant(id) {
  return request({
    url: '/organization/tenant/' + id,
    method: 'delete'
  })
}

export function getUserCondition(data) {
  return request({
    url: '/organization/tenant/user/condtions',
    method: 'post',
    data
  })
}