import { useState } from "react";
import { Button } from "react-bootstrap";
import { useFetch, useScroll } from "@hooks";
import { useNavigate, useSearchParams } from "react-router-dom";
import { searchService } from "@services";
import { v4 as uuidv4 } from "uuid";
import { IoMdArrowDropleft, IoMdArrowDropright } from "react-icons/io";

export default function Tags() {
  const [tagQuery, setTagQuery] = useState("");
  const [searchParams] = useSearchParams();
  const query = searchParams.get("query");
  const navigate = useNavigate();
  const { data: tags } = useFetch(searchService.getAllTags);
  const { scroll, scrollRef } = useScroll();
  uuidv4();

  const handleTagQuery = (tag) => {
    setTagQuery(tag);
    navigate(`/search/?query=${tag}`);
  };

  console.log(tags);

  return (
    <div className="position-relative mt-3">
      <div
        className="overflow-x-auto overflow-y-hidden scrollbody px-lg-3"
        style={{ minWidth: "100%" }}
        ref={scrollRef}
      >
        <div className="d-flex align-items-center gap-2 ">
          {tags.map((tag) => (
            <Button
              key={uuidv4()}
              variant="solid"
              style={{
                backgroundColor:
                  tag === tagQuery || tag === query
                    ? "var(--dark100)"
                    : "lightGrey",
                color:
                  tag === tagQuery || tag === query
                    ? "var(--white100)"
                    : "var(--dark100)",
                minWidth: "fit-content",
              }}
              size="sm"
              className="rounded-3 fw-bold border-0 text-lowercase cursor"
              onClick={() => handleTagQuery(tag)}
            >
              {tag}
            </Button>
          ))}
        </div>
      </div>
      <IoMdArrowDropleft
        className="d-none d-md-block position-absolute top-50 start-0 translate-middle z-2 cursor"
        size="35px"
        color="#dd5e14"
        onClick={() => scroll("left")}
      />
      <IoMdArrowDropright
        className="d-none d-md-block position-absolute top-50 start-100 translate-middle z-2 cursor"
        size="35px"
        color="#dd5e14"
        onClick={() => scroll("right")}
      />
    </div>
  );
}
