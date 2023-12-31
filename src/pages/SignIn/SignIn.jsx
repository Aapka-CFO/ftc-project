import { useState } from "react";
import "./SignIn.scss";
import GoogleIcon from "../../assets/images/google.png";
import LinkedInIcon from "../../assets/images/linkedin.png";
import FacebookIcon from "../../assets/images/facebook.png";
import TwitterIcon from "../../assets/images/twitter.png";
import BgImage from "../../assets/images/sign-in-image.png";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import { signin } from "../../apiCall";
import { toast } from "react-hot-toast";
import { useStateValue } from "../../StateProvider";

export const SignIn = () => {
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const [{ isLoading }, dispatch] = useStateValue();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: { username_or_email: "", password: "" },
  });

  const signinMutation = useMutation(signin, {
    onSuccess: (data) => {
      const loginFailed = data?.data["status"][0]["Error"];
      if (loginFailed === "False") {
        sessionStorage.setItem("token", data?.data?.access_token);
        sessionStorage.setItem("refresh_token", data?.data?.refresh_token);
        toast.success("Login successful");
        dispatch({ type: "SET_LOADING", status: false });
        dispatch({ type: "SET_LOGIN_STATUS", status: true });
        navigate("/");
      } else {
        dispatch({ type: "SET_LOADING", status: false });
        const errResponses = data?.data["status"][0]["Message"];
        const message = Object.values(errResponses);
        toast.error(message[0]);
      }
    },
    onError: (err) => {
      toast.error("Something went wrong");
      console.log(err, "Error");
      dispatch({ type: "SET_LOADING", status: false });
    },
  });

  // Do sign in
  const doSignin = (values) => {
    dispatch({ type: "SET_LOADING", status: true });
    signinMutation.mutate(values);
  };
  return (
    <div className="sign-in-container">
      <div className="inner-div">
        <div className="form-side">
          <form onSubmit={handleSubmit(doSignin)}>
            <h1>Sign in</h1>
            <div className="input-box">
              <input
                type="text"
                name="username_or_email"
                {...register("username_or_email", {
                  required: "This field is required",
                })}
                placeholder="Email / Username"
              />
              <small className="error">
                {errors.username_or_email?.message}
              </small>
            </div>
            <div className="input-box">
              <input
                name="password"
                type={`${showPassword ? "text" : "password"}`}
                {...register("password", { required: "Password is required" })}
                placeholder="Password"
              />
              <small className="error">{errors.password?.message}</small>
            </div>
            <div className="show-pass-text">
              <input
                type="checkbox"
                value={showPassword}
                onChange={() => setShowPassword(!showPassword)}
              />
              <span>Show password</span>
            </div>
            <span className="forgot-password-text">Forgot password?</span>
            <button type="submit" className="sign-in-btn">
              Sign in
            </button>
          </form>
          <span className="or">OR</span>
          <div className="social-media-icons">
            <div className="icon-box">
              <img src={GoogleIcon} alt="google-icon" />
            </div>
            <div className="icon-box">
              <img src={FacebookIcon} alt="facebook-icon" />
            </div>
            <div className="icon-box">
              <img src={LinkedInIcon} alt="linkedin-icon" />
            </div>
            <div className="icon-box">
              <img src={TwitterIcon} alt="twitter-icon" />
            </div>
          </div>
        </div>
        <div className="image-side">
          <img src={BgImage} alt="img" />
        </div>
      </div>
    </div>
  );
};
