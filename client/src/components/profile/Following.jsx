import PropTypes from "prop-types";
import { useFetch } from "@hooks";
import { userService } from "@services";
import { Spinner } from "@utils";
import { Link } from "react-router-dom";
import { Image } from "react-bootstrap";

export default function Following({ userId }) {
  const {
    data: following,
    error,
    loading,
  } = useFetch(userService.getFollowing, userId);

  return (
    <div className="mt-5">
      {error ? (
        <p className="mt-5">{error}</p>
      ) : (
        <>
          {loading ? (
            <Spinner text="Fetching followers..." />
          ) : (
            <>
              {following?.length > 0 ? (
                <div className="d-flex flex-wrap gap-3">
                  {following.map((follower) => (
                    <Link
                      to={`/profile/${follower.userName}`}
                      key={follower._id}
                      className="mb-2 p-2 text-center"
                    >
                      <Image
                        src={follower.profilePhoto}
                        alt={follower.userName}
                        loading="lazy"
                        style={{ width: "50px", height: "50px" }}
                        roundedCircle
                        className="object-fit-cover mb-2"
                      />
                      <p className="fw-bold small">{follower.userName}</p>
                    </Link>
                  ))}
                </div>
              ) : (
                <p>Not following anyone yet.</p>
              )}
            </>
          )}
        </>
      )}
    </div>
  );
}

Following.propTypes = {
  userId: PropTypes.string,
};
