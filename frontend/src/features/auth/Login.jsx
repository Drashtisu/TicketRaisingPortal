import React from 'react'
import { useDispatch } from 'react-redux'



const Login = () => {

const  dispatch =useDispatch()
const  navigate =useNavigate()
const [form ,setForm] =useState({name:"",email:"",password:""})

const handleLoginsubmit =()=>{
dispatch();

}

    return (
    <div>
        <form action="" onSubmit={handleLoginsubmit} className='common-form'>
            <label htmlFor="">Enter Name</label>
            <input type="text" placeholder='Enter  Name' />
            <label htmlFor="">Enter Email</label>
            <input type="email" placeholder='Enter  Email' />
            <label htmlFor="">Enter Password</label>
            <input type="password" placeholder='Enter  Password' />
             

             <button>Login</button>
             <a href="">Need Create Account</a>
        </form>
    </div>
  )
}

export default Login