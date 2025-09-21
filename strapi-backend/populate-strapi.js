const axios = require('axios'); 
 
const API_BASE = 'http://localhost:1337/api'; 
 
async function testAPI() { 
  try { 
    const response = await axios.get(API_BASE + '/imovels'); 
    console.log('API conectada. Total:', response.data.meta.pagination.total); 
  } catch (error) { 
    console.log('Erro:', error.response?.status, error.response?.data?.error?.message); 
  } 
} 
 
testAPI(); 
