import fetch from 'utils/fetch';
import qs from 'qs';

export function list(params){
	return fetch({
		url: '/admin/homepage/banner/list',
		method: 'get',
		params
	})
}
export function update(params){
	return fetch({
		url: '/admin/homepage/banner/modify',
		method: 'post',
		data: qs.stringify(params)
	})
}
export function create(params){
	return fetch({
	url: '/admin/homepage/banner/add',
	method: 'post',
		data: qs.stringify(params)
})
}
export function enable(params){
	return fetch({
		url: '/admin/homepage/banner/change',
		method: 'post',
		data: qs.stringify(params)
	})
}
export function detail(params){
	return fetch({
		url: '/admin/homepage/banner/get',
		method: 'post',
		// method: 'get',
		// params
		data: qs.stringify(params)
	})
}
export function remove(params){
	return fetch({
		url: '/admin/homepage/banner/remove',
		method: 'post',
		data: qs.stringify(params)
	})
}