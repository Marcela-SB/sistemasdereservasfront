import axios from 'axios'

const axiosInstance = axios.create({
    baseURL:"http://localhost:8087/"
})

export default axiosInstance