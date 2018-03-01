import fetch from 'utils/fetch';
import qs from 'qs';

export function diaryList(params) {
	return fetch({
		url: '/admin/diary/list',
		method: 'post',
		data: qs.stringify(params)
	})
}
export function changeShelfStatus(id,operate_desc,sys_status) {
	var params = {
		id,operate_desc,sys_status
	}
	return fetch({
		url: '/admin/diary/operate',
		method: 'post',
		data: qs.stringify(params)
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