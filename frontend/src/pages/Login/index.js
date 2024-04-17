import React, { useState, useContext, useEffect } from "react";
import { Link as RouterLink } from "react-router-dom";

import {
    TextField,
    InputAdornment,
    IconButton
} from '@material-ui/core';

import { LockOutlined, Visibility, VisibilityOff } from '@material-ui/icons';

import '../../assets/style.css';

import { i18n } from "../../translate/i18n";

import { AuthContext } from "../../context/Auth/AuthContext";

import wave from '../../assets/wave.png'
import bg from '../../assets/bg.svg'
import avatar from '../../assets/logo.png'
import logo from '../../assets/logo.png';

const Login = () => {
    const [user, setUser] = useState({ email: "", password: "" });
    const [showPassword, setShowPassword] = useState(false);

    const { handleLogin } = useContext(AuthContext);

    const handleChangeInput = (e) => {
        setUser({ ...user, [e.target.name]: e.target.value });
    };

    const handlSubmit = (e) => {        
        e.preventDefault();
        handleLogin(user);
    };

    return (
        <>
            <img className="wave" src={wave} />
            <div className="container">
                <div className="img">
                    <img src={bg} />
                </div>
                <div className="login-content" style={{ alignItems: "center" }}>
                    <form noValidate onSubmit={handlSubmit} style={{ display: "grid" }}>
                        <img src={avatar} />
                        {/* <img alt="logo" style={{ maxWidth: 500, marginBottom: 20 }} src={logo}></img> */}
                        <TextField
                            variant="standard"
                            margin="normal"
							// color="warning"
                            required
                            fullWidth
                            id="email"
                            label={i18n.t("login.form.email")}
                            name="email"
                            value={user.email}
                            onChange={handleChangeInput}
                            autoComplete="email"
                            autoFocus
                        />
                        <TextField
                            variant="standard"
                            margin="normal"
							// color="success"
                            required
                            fullWidth
                            name="password"
                            label={i18n.t("login.form.password")}
                            id="password"
                            value={user.password}
                            onChange={handleChangeInput}
                            autoComplete="current-password"
                            type={showPassword ? 'text' : 'password'}
                            InputProps={{
                                endAdornment: (
                                    <InputAdornment position="end">
                                        <IconButton
                                            aria-label="toggle password visibility"
                                            onClick={() => setShowPassword((e) => !e)}
                                        >
                                            {showPassword ? <VisibilityOff /> : <Visibility />}
                                        </IconButton>
                                    </InputAdornment>
                                )
                            }}
                        />
                        <input type="submit" className="btn" value="Acessar" />
                    </form>
                </div>
            </div>
        </>
    );
};

export default Login;
