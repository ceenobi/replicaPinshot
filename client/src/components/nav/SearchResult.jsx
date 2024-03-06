import { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { Link, useNavigate } from "react-router-dom";
import { Image } from "react-bootstrap";
import { ClipLoader } from "react-spinners";
import { searchService } from "@services";

export default function SearchResult({ searchQuery, setResultBox }) {
  const [result, setResult] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const delaySearchFn = setTimeout(() => {
      const searchRequest = async () => {
        try {
          setLoading(true);
          const res = await searchService.searchUserOrPin(searchQuery);
          setResult(res.data);
        } catch (error) {
          console.log(error);
          setError(error);
        } finally {
          setLoading(false);
        }
      };
      searchRequest();
    }, 500);
    return () => clearTimeout(delaySearchFn);
  }, [searchQuery]);

  const redirectToSearch = () => {
    navigate(`/search/?query=${searchQuery}`);
    setResultBox(false);
  };

  const filterUsers = result.filter((data) => data?.email);
  const filterPins = result.filter((data) => data?.title);

  return (
    <div className="mt-5 p-4 bg-light shadow rounded-3 searchbox scrollbody">
      <div className="position-relative py-4">
        {error ? (
          <p>{error.message}</p>
        ) : (
          <>
            {loading ? (
              <div className="w-100 mx-auto text-center">
                <ClipLoader color="#dd5e14" />
              </div>
            ) : (
              <>
                {result?.length > 0 ? (
                  <>
                    <div className="mb-2">
                      <h1 className="fs-6 text-black">
                        We found {result?.length} results
                      </h1>
                      {filterPins.length > 0 && (
                        <>
                          <h1 className="fs-6 mt-2 text-secondary fw-bold">
                            Pins
                          </h1>
                          {filterPins.slice(0, 5).map((pin) => (
                            <div
                              key={pin._id}
                              className="d-flex align-items-center gap-2 mb-2 p-2 hovershade"
                              onClick={() => setResultBox(false)}
                            >
                              <Link to={`/pin/${pin._id}`}>
                                <Image
                                  className="rounded-4 object-fit-cover"
                                  src={pin?.image[0]}
                                  alt={pin.title}
                                  loading="lazy"
                                  style={{
                                    width: "45px",
                                    height: "45px",
                                    borderRadius: "50%",
                                  }}
                                />
                              </Link>
                              <Link
                                to={`/pin/${pin._id}`}
                                className="fw-bold text-black"
                              >
                                {pin.title}
                              </Link>
                            </div>
                          ))}
                        </>
                      )}
                      <>
                        {filterUsers.length > 0 && (
                          <>
                            <h1 className="fs-6 text-secondary fw-bold">
                              Accounts
                            </h1>
                            {filterUsers.map((pin) => (
                              <div
                                key={pin._id}
                                className="d-flex align-items-center gap-2 mb-2 p-2 hovershade"
                                onClick={() => setResultBox(false)}
                              >
                                <Link to={`/profile/${pin.userName}`}>
                                  <Image
                                    className="rounded-4 object-fit-cover"
                                    src={pin.profilePhoto}
                                    alt={pin.userName}
                                    loading="lazy"
                                    style={{
                                      width: "45px",
                                      height: "45px",
                                    }}
                                    roundedCircle
                                  />
                                </Link>
                                <Link
                                  to={`/profile/${pin.userName}`}
                                  className="fw-bold text-black"
                                >
                                  {pin.userName}
                                </Link>
                              </div>
                            ))}
                          </>
                        )}
                      </>
                    </div>
                  </>
                ) : (
                  <p className="fs-6 mt-5 text-center text-black">
                    Sorry we could not find any available result for{" "}
                    <span className="fw-bold">
                      &quot;{searchQuery}
                      &quot;
                    </span>
                  </p>
                )}
              </>
            )}
          </>
        )}
        {result?.length > 10 && (
          <p
            className="position-absolute top-100 start-50 translate-middle cursor text-black activeIcon"
            onClick={redirectToSearch}
          >
            View all results
          </p>
        )}
      </div>
    </div>
  );
}

SearchResult.propTypes = {
  searchQuery: PropTypes.string,
  setResultBox: PropTypes.any,
};
