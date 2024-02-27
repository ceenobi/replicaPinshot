import { useState } from "react";
import { PageLayout } from "@layouts";
import { useFetch, useSlide, useTitle, useAuthContext } from "@hooks";
import { useParams, Link } from "react-router-dom";
import { pinService } from "@services";
import { Spinner, downloadImage } from "@utils";
import { Row, Col, Image } from "react-bootstrap";
import { v4 as uuidv4 } from "uuid";
import { LazyLoadImage } from "react-lazy-load-image-component";
import { FaExpand, FaHeart } from "react-icons/fa";
import {
  IoMdArrowDropleft,
  IoMdArrowDropright,
  IoMdDownload,
} from "react-icons/io";
import { PinModal } from "@components";
import { toast } from "react-toastify";

export default function PinDetails() {
  const [showPicModal, setShowPicModal] = useState(false);
  const { pinId } = useParams();
  const {
    error,
    data: pin,
    loading,
    setData,
  } = useFetch(pinService.getAPin, pinId);
  const { nextSlide, prevSlide, current, setCurrent } = useSlide(
    pin?.image?.length
  );
  const { loggedInUser } = useAuthContext() || {};
  useTitle(pin?.title);
  uuidv4();

  console.log(pin);

  const expandImg = (index) => {
    setShowPicModal(true);
    setCurrent(index);
  };

  const handleLike = async () => {
    try {
      const res = await pinService.likeAPin(pinId, loggedInUser._id);
      toast.success(res.data);
      const pin = await pinService.getAPin(pinId);
      setData(pin.data);
    } catch (error) {
      console.log(error);
      toast.error(
        loggedInUser._id
          ? error.response?.data.error
          : "Unauthorized: login to perform action"
      );
    }
  };

  const handleDislike = async () => {
    try {
      const res = await pinService.dislikeAPin(pinId, loggedInUser._id);
      toast.success(res.data);
      const pin = await pinService.getAPin(pinId);
      setData(pin.data);
    } catch (error) {
      console.log(error);
      toast.error(
        loggedInUser._id
          ? error.response?.data.error
          : "Unauthorized: login to perform action"
      );
    }
  };

  return (
    <PageLayout>
      {error ? (
        <p>{error}</p>
      ) : (
        <>
          {loading && <Spinner text="Fetching pin" />}
          <Row className="g-3">
            <Col lg={6} className="mb-4">
              <div className="w-100">
                {pin.image?.map((img, i) => (
                  <div key={uuidv4()} className="pinId-Img position-relative">
                    {i === current && (
                      <>
                        <LazyLoadImage
                          effect="blur"
                          src={img}
                          alt={pin.title}
                          className="rounded-4 object-fit-cover"
                          width="100%"
                          height="100%"
                        />
                        <div
                          className="position-absolute top-0 end-0 p-2"
                          title="click to view full size"
                        >
                          <FaExpand
                            color="white"
                            className="cursor"
                            size="24px"
                            onClick={() => expandImg(i)}
                          />
                        </div>
                        {pin.image?.length > 1 && (
                          <div className="focus-arrow d-none d-md-block">
                            <IoMdArrowDropleft
                              className="position-absolute top-50 start-0 translate-middle z-2 cursor"
                              size="50px"
                              color="#dd5e14"
                              onClick={prevSlide}
                            />
                            <IoMdArrowDropright
                              className="position-absolute top-50 start-100 translate-middle z-2 cursor"
                              size="50px"
                              color="#dd5e14"
                              onClick={nextSlide}
                            />
                          </div>
                        )}
                      </>
                    )}
                  </div>
                ))}
                <>
                  {pin.image?.length > 1 && (
                    <div className="mt-3 d-flex d-md-none gap-2">
                      {pin.image?.map((img, i) => (
                        <Image
                          key={uuidv4()}
                          src={img}
                          onClick={() => setCurrent(i)}
                          style={{ width: "50px", height: "50px" }}
                          className={
                            i === current
                              ? "rounded-4 border border-2 border-warning"
                              : "rounded-4 "
                          }
                        />
                      ))}
                    </div>
                  )}
                </>
                <>
                  {showPicModal && (
                    <PinModal
                      showPicModal={showPicModal}
                      setShowPicModal={setShowPicModal}
                      current={current}
                      pin={pin}
                      prevSlide={prevSlide}
                      nextSlide={nextSlide}
                    />
                  )}
                </>
              </div>
            </Col>
            <Col lg={6} className="mb-4 px-lg-4">
              <h1 className="fw-bold mb-4 display-6">{pin.title}</h1>
              <p className="mb-4">{pin.description}</p>
              <div className="mb-4 d-flex gap-4 w-100">
                {pin.image?.map((img, i) => (
                  <div key={uuidv4()} title="download this image">
                    {i === current && (
                      <IoMdDownload
                        size="30px"
                        className="cursor"
                        onClick={() => downloadImage(pin.title, img)}
                      />
                    )}
                  </div>
                ))}
                <div className="d-flex align-items-center gap-2">
                  <FaHeart
                    size="30px"
                    className={`cursor ${pin.likes?.includes(
                      loggedInUser._id ? "text-danger" : ""
                    )}`}
                    title={
                      pin.likes?.includes(loggedInUser._id)
                        ? "You liked this pin"
                        : "Click to like"
                    }
                    onClick={
                      pin.likes?.includes(loggedInUser._id)
                        ? handleDislike
                        : handleLike
                    }
                  />
                  <span>{pin.likes?.length} likes</span>
                </div>
              </div>
              <div className="d-flex align-items-center ">
                <div className="d-flex align-items-center gap-2 flex-grow-1">
                  <Link to={`/profile/${pin.userId?.username}`}>
                    <Image
                      src={pin.userId?.profilePhoto}
                      roundedCircle
                      style={{ width: "45px", height: "45px" }}
                      alt={pin.userId?.username}
                    />
                  </Link>
                </div>
              </div>
            </Col>
          </Row>
        </>
      )}
    </PageLayout>
  );
}
