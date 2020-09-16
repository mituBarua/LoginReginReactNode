import React, { useState, useRef } from "react";
import loginImg from "../../login.svg";
import {Button} from '@material-ui/core';
import axios from 'axios';
import SimpleReactValidator from 'simple-react-validator';

function Register()  {

    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setconfirmPassword] = useState('');
    const validator = useRef(new SimpleReactValidator({}));

    const submitForm = (e)=> {
      e.preventDefault();
      if (validator.current.allValid()) {
            let request = {
              UserName : name,
              Email: email,
              Password: password,
              ConfirmPassword: confirmPassword
            }
            if(request.Password === request.ConfirmPassword){
              axios.post('http://localhost:5000/reg', request)
              .then( resp => {
                if(resp.data.success) {
                  alert("Registered successfully!!!!!");
                  console.log(resp);
                }
                else{
                  alert("Email Already Exist!!!!!")
                }
               
              })
              .catch( err => {
                console.log(err);
              })
              
          
            } 
            else{
              alert("password doesn't match");
            }
          }
      else {
     alert("Please fill up all field");
        validator.current.showMessages();
      }
    }
    return (
      <div className="base-container">
          <div className="header">Register</div>
          <div className="content">
            <div className="image">
              <img src={loginImg} />
            </div>
          <div className="form">
            <form id="FormSub" >
              <div className="form-group">
                <label htmlFor="username">Username</label>
                < input 
                  type="text" 
                  value={name}
                  placeholder="name" 
                  onChange={e => setName(e.target.value)}
                  onBlur={() => validator.current.showMessageFor('name')}
                />
                {validator.current.message('name', name, 'required', { className: 'text-danger' })}
             </div>

              <div className="form-group">
                <label htmlFor="email">Email</label>
                < input
                    type="email" 
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder="email"
                    onBlur={() => validator.current.showMessageFor('email')}
                  />
                  {validator.current.message('email', email, 'required|email', { className: 'text-danger' })}
              </div>

              <div className="form-group">
                <label htmlFor="password">Password</label>
                <input 
                  id="password"
                  type="password" 
                  placeholder="password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  onBlur={() => validator.current.showMessageFor('password')}
                />
                {validator.current.message('password', password, 'required|alpha_num', { className: 'text-danger--------' })}
              </div>

              <div className="form-group">
                <label htmlFor="password">Confirm Password</label>
                <input
                  type="password"
                  placeholder="confirm password"
                  value={confirmPassword}
                  onChange={e => setconfirmPassword(e.target.value)}
                  onBlur={() => validator.current.showMessageFor('confirmPassword')}
                  id="confirmpassword"
                />
                {validator.current.message('confirmPassword', confirmPassword, 'required|alpha_num', { className: 'text-danger' })}
              </div>


                <div className="footer">
                  <Button  type="submit" className="btn" onClick={submitForm} variant="contained" color="primary">
                      Register
                  </Button>
              </div>
          </form>
         </div>
        </div>
      </div>
    );
}

export default Register;



  

