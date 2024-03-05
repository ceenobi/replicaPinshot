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
        try {
          setLoading(true);
          const res = await searchService.searchUserOrPin(query);
          console.log(res);
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
            <div className="mt-5">
              {result?.length > 0 ? (
                <>
                  <MasonryLayout>
                    {filterPins.map((pin) => (
                      <PinCard key={pin._id} {...pin} />
                    ))}
                  </MasonryLayout>
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
