
import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';

const Register = () => {
    const dispatch = useDispatch()
  const  navigate =useNavigate()
const [from ,setForm ] =useState({name:"",email:"",password:"",phone:"" ,role :""})

const  handleSubmit =async( e)=>{
e.preventDefault()
dispatch();
}


  return (
    <div>
        
       <form action="" onSubmit={handleSubmit} className='common-form'>
            <label htmlFor="">Enter Name</label>
            <input type="text" placeholder='Enter  Name' />
            <label htmlFor="">Enter Email</label>
            <input type="email" placeholder='Enter  Email' />
            <label htmlFor="">Enter Password</label>
            <input type="password" placeholder='Enter  Password' />
            <label htmlFor="">Enter Phone</label>
            <input type="number" placeholder='Enter  Phone Number' />
            <label htmlFor="">role</label>
            <select name="" id="">
                <option value="">user</option>
                <option value="">admin</option>
                <option value="agent"></option>
            </select>
             

             <button>register</button>
             <a href="">Alreay have account then go  for  login</a>
        </form>
    </div>
  )
}

export default Register




