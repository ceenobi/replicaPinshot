import { useState } from "react";
import { PageLayout } from "@layouts";
import { useParams } from "react-router-dom";
import { Image, Tab, Tabs } from "react-bootstrap";
import { format } from "timeago.js";
import { useFetch, useTitle, useAuthContext } from "@hooks";
import { Spinner } from "@utils";
import { userService } from "@services";
import {
  MyButton,
  UserPins,
  UserLikedPins,
  Followers,
  Following,
  UpdateProfile,
} from "@components";
import { toast } from "react-toastify";
import { ClipLoader } from "react-spinners";

export default function Profile() {
  const [isSending, setIsSending] = useState(false);
  const [isFollow, setIsFollow] = useState(false);
  const { userName } = useParams();
  const {
    error,
    data: user,
    loading,
    setData,
  } = useFetch(userService.getUserProfile, userName);
  const { loggedInUser, setLoggedInUser } = useAuthContext();
  useTitle(`${user?.userName}'s profile`);

  const resendEmailLink = async () => {
    setIsSending(true);
    try {
      const { status, data } = await userService.resendEmailVerificationLink(
        loggedInUser._id
      );
      if (status === 200) {
        toast.success(data.sendMail.msg);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.response.data.error);
    } finally {
      setIsSending(false);
    }
  };

  const follow = async (userId) => {
    setIsFollow(true);
    try {
      const res = await userService.followAUser(userId, loggedInUser._id);
      if (res.status === 200) {
        const userProfile = await userService.getUserProfile(userName);
        setData(userProfile.data);
        const user = await userService.authUser();
        setLoggedInUser(user.data);
        toast.success(res.data);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.response?.data.error);
    } finally {
      setIsFollow(false);
    }
  };

  const unfollow = async (userId) => {
    setIsFollow(true);
    try {
      const res = await userService.unfollowAUser(userId, loggedInUser._id);
      if (res.status === 200) {
        const userProfile = await userService.getUserProfile(userName);
        setData(userProfile.data);
        const user = await userService.authUser();
        setLoggedInUser(user.data);
        toast.success(res.data);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.response?.data.error);
    } finally {
      setIsFollow(false);
    }
  };

  const isFollowed = loggedInUser.following?.includes(user?._id);

  return (
    <PageLayout>
      {error ? (
        <p className="mt-4">{error}</p>
      ) : (
        <>
          {loading ? (
            <Spinner text="Fetching user" />
          ) : (
            <div>
              <div className="d-md-flex justify-content-center gap-3  text-center text-md-start">
                <div>
                  <Image
                    src={user?.profilePhoto}
                    style={{ width: "120px", height: "120px" }}
                    roundedCircle
                    className="mb-2 object-fit-cover"
                    alt={user?.userName}
                  />
                  {loggedInUser._id === user._id && (
                    <UpdateProfile user={user} setData={setData} />
                  )}
                </div>
                <div>
                  <div className="mb-0 d-flex flex-wrap align-items-center justify-content-center justify-content-md-start gap-2">
                    <span className="fs-4 fw-bold">@{user?.userName}</span>
                    <div className="d-flex flex-wrap align-items-center gap-2 text-secondary">
                      <span>* {user?.followers?.length} followers</span>
                      <span>* {user?.following?.length} following</span>
                    </div>
                  </div>
                  <p className="mb-1 fw-medium">{user?.email}</p>
                  <div className="mb-2 d-md-flex gap-2 align-items-center">
                    {loggedInUser._id === user?._id && (
                      <>
                        <p className="fw-bold mb-1">Account Verification:</p>
                        <span className="me-2">
                          {user?.isVerified ? "Verified" : "Not verified"}
                        </span>
                        {!user?.isVerified && (
                          <MyButton
                            text={isSending ? "Sending..." : "Resend link"}
                            style={{ backgroundColor: "var(--orangeLight)" }}
                            disabled={isSending}
                            onClick={resendEmailLink}
                          />
                        )}
                      </>
                    )}
                  </div>
                  <p className="mb-0">
                    <b>Bio:&nbsp;</b>
                    {user?.bio}
                  </p>
                  <p className="mb-1">
                    <b>Member since:&nbsp;</b>
                    {format(user?.createdAt)}
                  </p>
                  {loggedInUser._id !== user?._id && (
                    <>
                      {isFollow ? (
                        <ClipLoader color="#dd5e14" size="14px" />
                      ) : (
                        <MyButton
                          text={isFollowed ? "Unfollow" : "Follow"}
                          style={{
                            backgroundColor: isFollowed
                              ? "var(--teal200)"
                              : "var(--orangeLight",
                          }}
                          onClick={
                            isFollowed
                              ? () => unfollow(user?._id)
                              : () => follow(user?._id)
                          }
                        />
                      )}
                    </>
                  )}
                </div>
              </div>
              <Tabs
                defaultActiveKey="user"
                id="user-profile-tab"
                className="mt-5"
                fill
              >
                <Tab eventKey="user" title="Pins">
                  <UserPins userId={user?._id} />
                </Tab>
                <Tab eventKey="likedPins" title="Liked Pins">
                  <UserLikedPins userId={user?._id} />
                </Tab>
                <Tab eventKey="followers" title="Followers">
                  <Followers userId={user?._id} />
                </Tab>
                <Tab eventKey="following" title="Following">
                  <Following userId={user?._id} />
                </Tab>
              </Tabs>
            </div>
          )}
        </>
      )}
    </PageLayout>
  );
}
