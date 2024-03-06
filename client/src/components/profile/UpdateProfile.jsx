import { useState } from "react";
import { Form } from "react-bootstrap";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import PropTypes from "prop-types";
import { ClipLoader } from "react-spinners";
import { registerOptions } from "@utils";
import { userService } from "@services";
import { FormFields } from "@layouts";
import { toast } from "react-toastify";
import { MyButton, ImageUpload, MyModal } from "@components";
import { uploadToCloudinary } from "@config";
import { useAuthContext } from "@hooks";

export default function UpdateProfile({ user, setData }) {
  const [show, setShow] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const { setLoggedInUser } = useAuthContext();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      userName: user?.userName,
      email: user?.email,
      password: "",
      bio: user?.bio,
    },
  });

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const togglePassword = () => {
    setShowPassword((prev) => !prev);
  };

  const onSubmitHandler = async ({
    userName,
    email,
    password,
    profileImage,
    bio,
  }) => {
    try {
      let profilePhoto = "";
      if (profileImage && profileImage?.length > 0) {
        const uploadResponse = await uploadToCloudinary(profileImage[0]);
        profilePhoto = uploadResponse.data.secure_url;
      }
      const { status, data } = await userService.updateProfile(
        userName,
        email,
        password,
        profilePhoto,
        bio
      );
      if (status === 200) {
        toast.success(data.msg);
        const res = await userService.authUser();
        setLoggedInUser(res.data);
        setData(res.data);
        navigate(`/profile/${res.data.userName}`);
        handleClose();
      }
    } catch (error) {
      console.log(error);
      toast.error(error.response?.data.error);
    }
  };

  return (
    <>
      <p className="text-center cursor" onClick={handleShow}>
        Edit Profile
      </p>
      <MyModal show={show} handleClose={handleClose} title="Edit Profile">
        <Form onSubmit={handleSubmit(onSubmitHandler)}>
          <FormFields
            register={register}
            errors={errors?.userName}
            registerOptions={registerOptions?.userName}
            className="my-4"
            id="userName"
            name="userName"
            label="Username"
            type="text"
            placeholder="Username"
          />
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
          <FormFields
            register={register}
            className="my-2 position-relative"
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
            className="my-4 position-relative"
            id="bio"
            name="bio"
            label="Bio"
            type="text"
            placeholder="Bio"
            registerOptions={registerOptions?.bio}
          />
          <ImageUpload
            id="profileImage"
            name="profileImage"
            title="Change profile image"
            register={register}
          />
          <MyButton
            text={isSubmitting ? <ClipLoader color="#ffffff" /> : "Update"}
            style={{ backgroundColor: "var(--orangeLight)" }}
            disabled={isSubmitting}
            type="submit"
            className="w-100"
          />
        </Form>
      </MyModal>
    </>
  );
}

UpdateProfile.propTypes = {
  user: PropTypes.any,
  setData: PropTypes.any,
};
