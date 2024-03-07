import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { userService } from "@services";
import { useFetch, useAuthContext } from "@hooks";
import { PageLayout } from "@layouts";
import { Spinner } from "@utils";

export default function VerifyAccount() {
  const { userId } = useParams();
  const { token } = useParams();
  const navigate = useNavigate();
  const { loggedInUser } = useAuthContext() || {};
  const { error, loading } = useFetch(
    userService.verifyUserAccount,
    userId,
    token
  );

  useEffect(() => {
    if (loggedInUser.isVerified) {
      toast.success("You are verified already");
      navigate("/");
    }
  }, [loggedInUser.isVerified, navigate]);

  return (
    <PageLayout>
      {error ? (
        <p className="mt-5">{error}</p>
      ) : (
        <>
          {loading ? (
            <Spinner text="Verifying..." />
          ) : (
            <>
              <h1 className="fs-4">Account verified successfully</h1>
            </>
          )}
        </>
      )}
    </PageLayout>
  );
}
