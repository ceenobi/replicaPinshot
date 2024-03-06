import { useEffect, useState } from "react";
import { Image, Tab, Tabs } from "react-bootstrap";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { searchService } from "@services";
import { Spinner } from "@utils";
import { useTitle } from "@hooks";
import { MasonryLayout, PinCard } from "@components";
import { PageLayout } from "@layouts";

export default function Search() {
  const [searchParams] = useSearchParams();
  const query = searchParams.get("query");
  const [result, setResult] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useTitle(`Search result for "${query}"`);

  useEffect(() => {
    const params = new URLSearchParams();
    if (query) {
      params.append("query", query);
    } else {
      params.delete("query");
    }
    navigate({ search: params.toString() });
  }, [navigate, query]);

  useEffect(() => {
    const delaySearchFn = setTimeout(() => {
      const searchRequest = async () => {
        if (!query) {
          return;
        }
        try {
          setLoading(true);
          const res = await searchService.searchUserOrPin(query);
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
  }, [query]);

  const filterUsers = result.filter((data) => data?.email);
  const filterPins = result.filter((data) => data?.title);

  return (
    <PageLayout>
      {error ? (
        <p>{error.message}</p>
      ) : (
        <>
          {loading ? (
            <Spinner text="Searching..." />
          ) : (
            <div className="mt-4">
              {result?.length > 0 ? (
                <>
                  <Tabs
                    defaultActiveKey="Pins"
                    id="pins-search-result"
                    className="mb-3"
                    fill
                  >
                    <Tab eventKey="Pins" title="Pins">
                      <MasonryLayout>
                        {filterPins.map((pin) => (
                          <PinCard key={pin._id} {...pin} />
                        ))}
                      </MasonryLayout>
                    </Tab>
                    <Tab eventKey="Account" title="Account">
                      {filterUsers?.length > 0 ? (
                        <div className="d-md-flex flex-wrap gap-3 mt-2">
                          {filterUsers.map((user) => (
                            <div
                              key={user._id}
                              className="d-flex flex-md-column align-items-center gap-2 mb-2 p-2 hovershade text-center"
                            >
                              <Link to={`/profile/${user.userName}`}>
                                <Image
                                  className="rounded-4 object-fit-cover"
                                  src={user.profilePhoto}
                                  alt={user.userName}
                                  loading="lazy"
                                  style={{
                                    width: "50px",
                                    height: "50px",
                                  }}
                                  roundedCircle
                                />
                              </Link>
                              <Link to={`/profile/${user.userName}`}>
                                <span
                                  to={`/profile/${user.userName}`}
                                  className="fw-bold"
                                >
                                  {user.userName}
                                </span>
                              </Link>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="fs-6 mt-5">
                          Sorry we could not find any available result for{" "}
                          <span className="fw-bold">
                            &quot;{query}
                            &quot;
                          </span>
                        </p>
                      )}
                    </Tab>
                  </Tabs>
                </>
              ) : (
                <p className="mt-4">
                  Sorry we could not find any available result for{" "}
                  <span className="fw-bold">
                    &quot;{query}
                    &quot;
                  </span>
                </p>
              )}
            </div>
          )}
        </>
      )}
    </PageLayout>
  );
}
