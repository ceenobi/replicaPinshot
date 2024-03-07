import Proptypes from "prop-types";
import { Link } from "react-router-dom";
import { LazyLoadImage } from "react-lazy-load-image-component";
import { FaHeart } from "react-icons/fa";
import { IoMdDownload } from "react-icons/io";
import { useAuthContext, useFetch } from "@hooks";
import { pinService } from "@services";
import { toast } from "react-toastify";

export default function PinCard({ _id, title, image }) {
  const { loggedInUser } = useAuthContext() || {};
  const { data, setData } = useFetch(pinService.getAPin, _id);

  const handleLike = async () => {
    try {
      const res = await pinService.likeAPin(_id, loggedInUser._id);
      toast.success(res.data);
      const pin = await pinService.getAPin(_id);
      setData(pin.data);
    } catch (error) {
      console.log(error);
      if (error.response) {
        toast.error(error.response.data.error);
      } else {
        toast.error("An error occurred");
      }
    }
  };

  const handleDislike = async () => {
    try {
      const res = await pinService.dislikeAPin(_id, loggedInUser._id);
      toast.success(res.data);
      const pin = await pinService.getAPin(_id);
      setData(pin.data);
    } catch (error) {
      console.log(error);
      if (error.response) {
        toast.error(error.response.data.error);
      } else {
        toast.error("An error occurred");
      }
    }
  };

  const isLiked = data.likes?.includes(loggedInUser._id);

  return (
    <>
      <div className="cardBox w-100 h-auto rounded-4 mb-0">
        <Link to={`/pin/${_id}`}>
          <LazyLoadImage
            effect="blur"
            src={image[0]}
            className="w-100 h-100 rounded-4 object-fit-cover"
            alt={title}
          />
        </Link>
        {loggedInUser && (
          <div className="d-none d-xl-block focus-heart p-2">
            <FaHeart
              className={`cursor ${isLiked ? "text-danger" : "text-white"}`}
              onClick={isLiked ? handleDislike : handleLike}
            />
          </div>
        )}
        {loggedInUser && (
          <div className="d-none d-xl-block focus-download p-2">
            <IoMdDownload color="white" />
          </div>
        )}
      </div>
      <p className="small fw-bold">
        {title?.length > 50 ? title.slice(0, 25) + "..." : title}
      </p>
    </>
  );
}

PinCard.propTypes = {
  _id: Proptypes.string,
  title: Proptypes.string,
  image: Proptypes.array,
};
