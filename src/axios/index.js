import axios from "axios";

let config={
    baseURL: 'http://47.115.227.186:8080',
    timeout:10000,
    withCredentials:true,
}
const instance = axios.create(config)

const baseURL='http://47.115.227.186:8080'

export default {baseURL}
