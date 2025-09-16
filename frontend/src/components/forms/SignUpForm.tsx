import { useState } from "react";
import Input from "../elements/Input";
import AuthButton from "../elements/AuthButton";
import passwordIcon from '../../assets/icons/password.svg'
import emailIcon from '../../assets/icons/email.svg'
import userIcon from '../../assets/icons/user.svg'

const SignUpForm = () => {
  const [name, setName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [Cpassword, setCPassword] = useState<string>("");

  const handleSignup = () => {};

  return (
    <>
      <div className="space-y-4">
        <Input placeholder="Full Name" onChange={(e)=>setName(e.target.value)} type="text" value={name} icon={userIcon}/>
        <Input placeholder="Email" onChange={(e)=>setEmail(e.target.value)} type="email" value={email} icon={emailIcon}/>
        <Input placeholder="Password" onChange={(e)=>setPassword(e.target.value)} type="password" value={password} icon={passwordIcon}/>
        <Input placeholder="Confirm Password" onChange={(e)=>setCPassword(e.target.value)} type="password" value={Cpassword} icon={passwordIcon}/>
        <AuthButton text="Sign Up" action={handleSignup} />
      </div>
    </>
  );
};

export default SignUpForm;