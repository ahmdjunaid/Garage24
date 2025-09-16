import { useState } from "react";
import Input from "../elements/Input";
import AuthButton from "../elements/AuthButton";
import passwordIcon from '../../assets/icons/password.svg'
import emailIcon from '../../assets/icons/email.svg'

const LoginForm = () => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");

  const handleLogin = () => {};

  return (
    <>
      <div className="space-y-4">
        <Input placeholder="Email" onChange={(e)=>setEmail(e.target.value)} type="email" value={email} icon={emailIcon}/>
        <Input placeholder="Password" onChange={(e)=>setPassword(e.target.value)} type="password" value={password} icon={passwordIcon}/>
        <AuthButton text="LOGIN" action={handleLogin} />
      </div>

      {/* Forgot password link */}
      <div className="text-center mt-4">
        <a href="#" className="text-sm text-gray-600 hover:text-red-500">
          Forgot password ?
        </a>
      </div>
    </>
  );
};

export default LoginForm;
