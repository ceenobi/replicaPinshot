import { connect, authHeader } from "@config";

const login = async (userName, password) => {
  return await connect.post("/auth/login", { userName, password });
};

const signup = async (userName, email, password) => {
  return await connect.post("/auth/signup", { userName, email, password });
};

const authUser = async () => {
  return connect.get("/auth", { headers: authHeader() });
};

const followAUser = async (followId, userId) => {
  return connect.put(`/auth/follow/${followId}`, userId, {
    headers: authHeader(),
  });
};

const unfollowAUser = async (followId, userId) => {
  return connect.put(`/auth/unfollow/${followId}`, userId, {
    headers: authHeader(),
  });
};

const getUserProfile = async (userName) => {
  return connect.get(`/auth/profile/${userName}`, {
    headers: authHeader(),
  });
};

const resendEmailVerificationLink = async (userId) => {
  return connect.post(`/auth/resend-token/${userId}`, userId, {
    headers: authHeader(),
  });
};

const getMyFollowers = async (userId) => {
  return connect.get(`/auth/followers/${userId}`, {
    headers: authHeader(),
  });
};

const getFollowing = async (userId) => {
  return connect.get(`/auth/following/${userId}`, {
    headers: authHeader(),
  });
};

const updateProfile = async (userName, email, password, profilePhoto, bio) => {
  return await connect.patch(
    "/auth/update-user",
    {
      userName,
      email,
      password,
      profilePhoto,
      bio,
    },
    {
      headers: authHeader(),
    }
  );
};

const recoverPassword = async (email) => {
  return await connect.post("/auth/verify-email", { email });
};

const resetPassword = async (userId, token, password) => {
  return await connect.patch(`/auth/reset-password/${userId}/${token}`, {
    password,
  });
};

const verifyUserAccount = async (userId, token) => {
  return await connect.patch(`/auth/verify-account/${userId}/${token}`);
};

const logout = () => {
  localStorage.clear();
  window.location.reload();
};

export default {
  login,
  signup,
  authUser,
  followAUser,
  unfollowAUser,
  logout,
  getUserProfile,
  resendEmailVerificationLink,
  getMyFollowers,
  getFollowing,
  updateProfile,
  recoverPassword,
  resetPassword,
  verifyUserAccount,
};
