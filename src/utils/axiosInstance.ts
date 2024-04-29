import axios from 'axios'

const axiosInstance = axios.create({
    baseURL:"http://10.3.227.44:8087/"
})

export default axiosInstance