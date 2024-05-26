import {
  CreateAccount,
  DontHaveAccount,
  EmailAddressLogIn,
  Href,
  OrSignInWith,
  Password,
  RememberPassword,
  SignIn,
  SignInToAccount,
  UsernameLogIn,
} from "@/Constant";
import { useAppDispatch, useAppSelector } from "@/Redux/Hooks";
import Cookies from "js-cookie";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "react-toastify";
import { Button, Form, FormGroup, Input, Label } from "reactstrap";
import imageOne from "../../../../public/assets/images/logo/logo.png";
import imageTwo from "../../../../public/assets/images/logo/logo_dark.png";
import { UserSocialApp } from "./UserSocialApp";
import { login, verify } from "@/Services/AuthService";
import { loginFailed, loginSuccess } from "@/Redux/Reducers/AuthSlice";

export const UserForm = () => {
  const { i18LangStatus } = useAppSelector((store) => store.langSlice);
  const [show, setShow] = useState(false);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showVerification, setShowVerification] = useState(false);

  const [verificationCode, setVerificationCode] = useState("");

  const router = useRouter();

  const { user, error, isLoggedIn } = useAppSelector((store) => store.auth);
  const dispatch = useAppDispatch();

  const formSubmitHandle = async () => {
    try {
      const authResponse = await login({ username, password });

      if (authResponse.status === 200) {
        setShowVerification(true);
        setEmail(authResponse.data.user.email);
        dispatch(loginSuccess(authResponse.data.user));
        Cookies.set("token", authResponse.data.accessToken);
      }
      toast.success("Please Enter Verification Code");
    } catch (error) {
      console.error("Error fetching data:", error.response.data.message);
      dispatch(loginFailed(error.response.data.message));
      toast.error("Please Enter Valid Email Or Password");
      // alert("Please Enter Valid Email Or Password");
    }
  };

  const verifyCode = async () => {
    try {
      const verifyResponse = await verify({
        email,
        code: verificationCode,
      });

      if (verifyResponse.status === 200) {
        router.push(`/en/file_manager`);
        toast.success("Verification successful");
      }
    } catch (error) {
      console.error("Error verifying code:", error.response.data.message);
      toast.error("Please Enter Valid Verification Code");
    }
  };

  return (
    <div>
      <div>
        <Link className="logo" href={`/${i18LangStatus}/sample_page`}>
          <img
            className="img-fluid for-light"
            src={imageOne.src}
            alt="login page"
          />
          <img
            className="img-fluid for-dark"
            src={imageTwo.src}
            alt="login page"
          />
        </Link>
      </div>
      <div className="login-main">
        {showVerification ? (
          <Form className="theme-form">
            <h4>Verification</h4>
            <p>Enter your verification code received by mail to login</p>
            <FormGroup>
              <Label className="col-form-label">Verification Code</Label>
              <Input
                type="text"
                value={verificationCode}
                onChange={(event) => setVerificationCode(event.target.value)}
              />
            </FormGroup>
            <FormGroup>
              <Button
                color="primary"
                block
                className="w-100"
                onClick={verifyCode}
              >
                Verify
              </Button>
            </FormGroup>
          </Form>
        ) : (
            <Form className="theme-form">
              <h4>{SignInToAccount}</h4>
              <p>Enter your username & password to login</p>
              <FormGroup>
                <Label className="col-form-label">{UsernameLogIn}</Label>
                <Input
                    type="text"
                    defaultValue={username}
                    onChange={(event) => setUsername(event.target.value)}
                />
              </FormGroup>
              <FormGroup>
                <Label className="col-form-label">{Password}</Label>
                <div className="position-relative">
                  <Input
                      type={show ? "text" : "password"}
                      defaultValue={password}
                      onChange={(event) => setPassword(event.target.value)}
                  />
                  <div className="show-hide" onClick={() => setShow(!show)}>
                    <span className="show"> </span>
                  </div>
                </div>
              </FormGroup>
              <FormGroup className="mb-0">
                <div className="checkbox p-0">
                  <Input id="checkbox1" type="checkbox"/>
                  <Label className="text-muted" htmlFor="checkbox1">
                    {RememberPassword}
                  </Label>
                </div>
                <div className="text-end mt-3">
                  <Button
                      color="primary"
                      block
                      className="w-100"
                      onClick={formSubmitHandle}
                  >
                    {SignIn}
                  </Button>
                </div>
              </FormGroup>
              <p className="mt-4 mb-0 text-center">
                {DontHaveAccount}
                <Link className="ms-2" href="/auth/register">
                  {CreateAccount}
                </Link>
              </p>
            </Form>
        )}
      </div>
    </div>
  );
};
