import fetch from 'utils/fetch';
import qs from 'qs';

export function fetchWishList(params) {
	return fetch({
		url: '/admin/wish/recommend/list',
		method: 'get',
		params: params
	})
}

export function createWish(params) {
	return fetch({
		url: '/admin/wish/recommend/add',
		method: 'post',
		data: qs.stringify(params)
	})
}
export function updateWish(params){
	return fetch({
		url: '/admin/wish/recommend/modify',
		method: 'post',
		data: qs.stringify(params)
	})
}

export function changeShelfStatus(params) {
	return fetch({
		url: '/admin/wish/is_using',
		method: 'post',
		data: qs.stringify(params)
	})
}

export function fetchWishById(params){
	return fetch({
		url: '/admin/wish/recommend/get',
		method: 'post',
		data: qs.stringify(params)
	})
}

export function remove(params){
	return fetch({
		url: '/admin/wish/recommend/remove',
		method: 'post',
		data: qs.stringify(params)
	})
}