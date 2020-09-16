import React, {useState,useRef} from "react";
import loginImg from "../../login.svg";
import {Button} from '@material-ui/core';
import axios from 'axios';
import SimpleReactValidator from 'simple-react-validator';
import "./style.scss";

 export default props => {


      const [email, setEmail] = useState("");
      const [password,setPassword] = useState("");
      const validator = useRef(new SimpleReactValidator({}));
    
      const login = (e) => {
          e.preventDefault();
          if (validator.current.allValid()) {
              let request = {
                Email: email,
                Password:password
              }
      // console.log(request);
    axios.post('http://localhost:5000/auth/login', request)
    .then(resp => {
    if(resp.data.success) {
     
      alert("Login Successfully!!!!");

      document.cookie="AccessToken="+resp.data.accessToken;
    //  document.cookie="RefreshToken="+resp.data.refreshToken;
     //console.log(resp.data.accessToken);
      
      console.log(resp);
    }
   else {
    alert("Please Login with Valid data!!!!");
    }
  })
    .catch( err => {
         console.log(err);
       
       })
    }
     
   else {
          alert("Please fill up all the fields!!!!!!");
          validator.current.showMessages("Please fill up all the fields");
        }
       
  }

    return (
      <div className="base-container" ref={props.containerRef}>
        <div className="header">Login</div>
        <div className="content">
        <div className="image">
            <img src={loginImg} alt='log in image' />
          </div>
          <div className="form">
        <form >
             <div className="form-group">
                <label htmlFor="email">Email</label>
                <input type="text"
                  type="email" 
                  value={email}
                  onChange={e=> setEmail(e.target.value)}
                  onBlur={() => validator.current.showMessageFor('email')}
                />
                   {validator.current.message('email', email, 'required|email', { className: 'text-danger' })}
                </div>

              <div className="form-group">
                <label htmlFor="password">Password</label>
                <input type="password"
                 value={password}
                 onChange={e=> setPassword(e.target.value)}
                 onBlur={() => validator.current.showMessageFor('password')}
                />
               {validator.current.message('password', password, 'required|alpha_num', { className: 'text-danger--------' })}
              </div>

              <div className="footer">
                <Button 
                 className="btn" 
                 variant="contained" 
                 color="primary"
                onClick={(e)=> {login(e)}}
                 >
                  Login
                </Button>
              </div>

        </form>
        </div>
        </div>
      </div>
    );
  
}




