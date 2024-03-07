import { Container } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import MyButton from "./MyButton";

export default function Error() {
  const navigate = useNavigate();
  return (
    <section className="mt-5">
      <Container className="mx-auto py-5 px-4">
        <p className="mt-5">
          Oops! This hurts me more than it hurts you,
          <br />
          The page you are looking for does not exist, might have been removed,
          had its name changed, <br />
          Or is temporarily unavailable.
        </p>
        <MyButton
          style={{ backgroundColor: "var(--orangeLight)" }}
          text="Click to go home"
          onClick={() => navigate("/")}
        />
      </Container>
    </section>
  );
}
