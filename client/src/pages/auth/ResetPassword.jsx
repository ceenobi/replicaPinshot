import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { FormFields, FormUi } from "@layouts";
import { registerOptions } from "@utils";
import { userService } from "@services";
import { useTitle, useAuthContext } from "@hooks";

export default function ResetPassword() {
  useTitle("Reset password");
  const [showPassword, setShowPassword] = useState(false);
  const { id } = useParams();
  const { token } = useParams();
  const { loggedInUser } = useAuthContext() || {};
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm();

  const from = location.search ? location.search.split("=")[1] : "/";

  useEffect(() => {
    if (loggedInUser) {
      navigate(from, { replace: true });
    }
  }, [from, loggedInUser, navigate]);

  const togglePassword = () => {
    setShowPassword((prev) => !prev);
  };

  const onFormSubmit = async ({ password, confirmPassword }) => {
    try {
      if (password !== confirmPassword) {
        toast.error("Passwords do not match");
        return;
      }
      const { status, data } = await userService.resetPassword(
        id,
        token,
        password
      );
      if (status === 200) {
        toast.success(data);
        navigate("/login");
      }
    } catch (error) {
      console.log(error);
      if (error.response) {
        toast.error(error.response.data.error);
      } else {
        toast.error(error.message || "An error occurred");
      }
    }
  };

  return (
    <FormUi
      isSubmitting={isSubmitting}
      title="Enter your new password"
      btnText="Reset"
      onSubmit={handleSubmit(onFormSubmit)}
    >
      <FormFields
        register={register}
        errors={errors?.password}
        registerOptions={registerOptions?.password}
        className="my-1 position-relative"
        id="password"
        name="password"
        label="Password"
        type="password"
        placeholder="Password"
        showPassword={showPassword}
        togglePassword={togglePassword}
      />
      <FormFields
        register={register}
        errors={errors?.confirmPassword}
        registerOptions={registerOptions?.confirmPassword}
        className="my-4"
        id="confirmPassword"
        name="confirmPassword"
        label="Confirm Password"
        type="password"
        placeholder="Password"
      />
    </FormUi>
  );
}
