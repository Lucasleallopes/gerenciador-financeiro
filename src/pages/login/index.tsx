import React, { useState } from "react";
import { useNavigate } from 'react-router-dom';
import { auth, provider } from '../../service/firebase';
import { createUserWithEmailAndPassword, signInWithPopup, signInWithEmailAndPassword } from 'firebase/auth';
import './style.css';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const createUser = () => {
    createUserWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        const user = userCredential.user;
        console.log("Usuário criado:", user.email);
        navigate('/dashboard');
      })
      .catch((error) => {
        console.error("Erro ao criar usuário:", error.code, error.message);
      });
  };

  const loginWithEmail = () => {
    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        const user = userCredential.user;
        console.log("Usuário logado:", user.email);
        navigate('/dashboard');
      })
      .catch((error) => {
        console.error("Erro ao fazer login:", error.code, error.message);
      });
  };

  const loginWithGoogle = () => {
    signInWithPopup(auth, provider)
      .then((result) => {
        const user = result.user;
        console.log("Usuário logado com Google:", user.email);
        navigate('/dashboard');
      })
      .catch((error) => {
        console.error("Erro ao fazer login com Google:", error.code, error.message);
      });
  };

  return (
    <div className="container-login">
      <div className="login-box">
        <h2>Login</h2>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Senha"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <div className="button-group">
          <button onClick={loginWithEmail}>Login</button>
          <button onClick={createUser}>Criar Conta</button>
          <button onClick={loginWithGoogle}>Login com Google</button>
        </div>
      </div>
    </div>
  );
}

export default Login;
