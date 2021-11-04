import axios from 'axios'
import FormData from 'form-data'

import React from 'react';
import { useState } from 'react';

const baseUrl = 'https://elated-lotus-328121.uc.r.appspot.com/predict';

let  getFishNames = async(path) =>{
    const formData = new FormData()
    formData.append('file',{uri: path, name: path.split('/').pop(), type: 'image/jpeg' })
    return axios
    .post(baseUrl, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
    .then((response) =>{
        //Handling JSON response.data
        return response.data
        })
    .catch(err => console.log(err));
}



export default {getFishNames,}
