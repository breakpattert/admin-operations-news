import fetch from 'utils/fetch';
import qs from 'qs';


export function bannerWishList(params) {
	return fetch({
		url: '/admin/statistics/account/get',
		method: 'get',
		params: params
	})
}
