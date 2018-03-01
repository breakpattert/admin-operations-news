import fetch from 'utils/fetch';
import qs from 'qs';

export function fetchWishList(params) {
	return fetch({
		url: '/admin/user/suggestion/list',
		method: 'get',
		params: params
	})
}

export function editor(id, process_desc){
	var params = {
		id, process_desc
	}
	return fetch({
		url: '/admin/user/suggestion/done',
		method: 'post',
		data: qs.stringify(params)
	})
}

export function detail(params){
	return fetch({
		url: '/admin/user/suggestion/detail',
		method: 'get',
		params
	})
}