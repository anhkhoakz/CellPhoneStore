import axios from "axios";
import process from "process";

const defaultHeaders = {
	Accept: "application/json, text/plain, */*; charset=utf-8",
	"Content-Type": "application/json; charset=utf-8",
	Pragma: "no-cache",
	"Cache-Control": "no-cache",
};

const instance = axios.create({
	baseURL: process.env.REACT_APP_API_BASE_URL || "http://localhost:5000",
	headers: defaultHeaders,
});

const methods = ["get", "post", "put", "delete"];

const http = {};
methods.forEach((method) => {
	http[method] = (url, data, config) => {
		return instance[method](url, data, config);
	};
});

export default http;

export const addRequestInterceptor = instance.interceptors.request.use.bind(instance.interceptors.request);
export const addResponseInterceptor = instance.interceptors.response.use.bind(instance.interceptors.response);
