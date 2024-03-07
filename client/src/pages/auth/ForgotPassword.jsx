import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { FormFields, FormUi } from "@layouts";
import { registerOptions } from "@utils";
import { userService } from "@services";
import { useTitle, useAuthContext } from "@hooks";

export default function ForgotPassword() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm();
  const { loggedInUser } = useAuthContext() || {};
  const navigate = useNavigate();
  useTitle("Forgot password");

  const from = location.search ? location.search.split("=")[1] : "/";

  useEffect(() => {
    if (loggedInUser) {
      navigate(from, { replace: true });
    }
  }, [from, loggedInUser, navigate]);

  const onFormSubmit = async ({ email }) => {
    try {
      const { status, data } = await userService.recoverPassword(email);
      if (status === 200) {
        toast.success(data);
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
      title="Recover Password"
      btnText="Submit"
      onSubmit={handleSubmit(onFormSubmit)}
    >
      <FormFields
        register={register}
        errors={errors?.email}
        registerOptions={registerOptions?.email}
        className="my-4"
        id="email"
        name="email"
        label="Email"
        type="email"
        placeholder="Email"
      />
    </FormUi>
  );
}
