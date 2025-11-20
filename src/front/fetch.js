//create our login function
export const login = async(email, password, dispatch) => {


    const options = {
        method: 'POST',
        headers: {
            "Content-Type": 'application/json',
        },
        body: JSON.stringify({
            email: email,
            password: password,
        })
    }      

    const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/token`, options);

    //anything that is not a 200 error code
    if (!response.ok) {
        const data = await response.json();
        console.log(data.msg);
        return {
            error: {
                status: response.status,
                statusText: response.statusText,
            }
        }
    }

    // if the response is type 200
    const data = await response.json();
    
    sessionStorage.setItem('token', data.access_token)
    //save to store
    dispatch({
        type: 'fetchedToken',
        payload: {
            token: data.access_token,
            isLoginSuccessful: true,
        }
    })
    //add sessionStorage
    //add the dispatch
    return data;
}
