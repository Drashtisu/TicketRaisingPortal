import axios from 'axios';

const  API =axios.create({
    baseurl :"http://localhost/5173/api",
    headers:{
        "Content-Type":"application/json"
    }
})

export default API 