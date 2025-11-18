export const UserAccess =({email, password, setEmail,setPassword})=>{
const backendUrl = import.meta.env.VITE_BACKEND_URL
    const handleLogin = async() => {
        const response = await fetch(backendUrl + "/api/login",{
            method: "POST", 
            headers: {
                "content-type": "application/json"
            },
            body: JSON.stringify({
                "username": email, 
                "password": password
            })
        })
        const data = await response.json()
        console.log(data)
        return
    }

    return (
        <div>
              <h1>Login</h1>
                <div>
                                    <input
                                        type="text"
                                        placeholder="Enter email"
                                        value={email}
                                        onChange={e => setEmail(e.target.value)}
                                        ></input>
                                </div>
                                
                                <div>
                                    <input
                                        type="text"
                                        placeholder="Enter password"
                                        value={password}
                                        onChange={e => setPassword(e.target.value)}
                                        />
                                </div>
                                <div>
                                    <button 
                                        onClick={handleLogin}
                                    >Login
                                    </button>
            </div>
               </div>
       )}
      