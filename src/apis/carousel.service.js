/**
 * Base service file for the interactive portal api. All data received 
 * will downloaded as raw binary data and encoded as ISO-8859-1 
 */

import axios from 'axios'
import iconv from 'iconv-lite'

const HOST = 'http://10.26.74.246:8080/interactiveportal/rest/itvidContent'
const PROD = 'On-Air-CGS'
//const QA = 'iPreview'
const APP_ID = 'TWCHD'

const request = axios.create({
    baseURL: HOST  + '/' + PROD + '/' + APP_ID,
    responseType: 'arraybuffer'
});

request.interceptors.response.use(res => iconv.decode(new Uint8Array(res.data), 'ISO-8859-1'))

export default request