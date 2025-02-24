import axios from 'axios'

/**
 * url prod
 * baseURL:"http://10.3.227.44:8087/"
 * 
 * url dev
 * baseURL:"http://localhost:8080/"
 * 
 * 
 */

const axiosInstance = axios.create({
    baseURL:"https://salas.deart.ufrn.br/api/"
})

export default axiosInstance