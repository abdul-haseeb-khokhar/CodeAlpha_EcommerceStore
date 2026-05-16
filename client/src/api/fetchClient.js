const BASE_URL = 'http://localhost:5000/api'

export const fetchClient = async (endpoint, options = {}) => {
    console.log('Fetch Client is called')
    const token = localStorage.getItem('token')

    const config = {
        ...options,
        headers: {
            'Content-Type': 'application/json',
            ...(token && { Authorization: `Bearer ${token}`}),
            ...options.headers
        }
    }

    const res = await fetch(`${BASE_URL}${endpoint}`, config)

    if(!res.ok){
        const error = await res.json()
        console.log(error)
        throw new Error(error.message || 'Something went wrong')
    }
    return  await res.json()
}