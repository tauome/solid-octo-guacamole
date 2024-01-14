import { Link } from "react-router-dom";
import { useState } from "react";
import axios from "axios";

export default function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState(''); 

    async function loginUser(e){
        e.preventDefault();
        try {
            await axios.post('/login', {
                email,
                password
            }, {withCredentials: true});
            alert('Login Successful')
        } catch (e) {
            alert('Login Failed')
        }; 
    }

    return ( 
        <div className="mt-4 grow flex items-center justify-around"> 
            <div className="mb-64">
                <h1 className="text-4xl text-center mb-4">Login</h1>
                <form onSubmit={loginUser}className="max-w-md mx-auto">
                    <input type="email" placeholder="your@email.com" 
                    value={email} 
                    onChange={e => setEmail(e.target.value)}></input>
                    <input type="password" placeholder="password" 
                    value={password} 
                    onChange={e => setPassword(e.target.value)}></input>
                    <button className="primary">Login</button>
                    <div className="text-center py-2 text-gray-500">
                    Don't have an account yet? <Link className="underline text-black" to="/register">Register</Link>
                    </div>
                </form>
            </div>   
        </div>
    )
}