import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import { useAuth } from "@/hooks/useAuth";
import { joinLinkAPI } from "@/features/joinLink/joinLinkAPI";
import { getApiErrorMessage } from "@/utils/api-error";

export const JoinPage: React.FC = () => {
  const { token } = useParams<{ token: string }>();
  const navigate = useNavigate();

  const { user, loading: authLoading, fetchUser, setActiveOrg } = useAuth();

  const [organizationName, setOrganizationName] = useState<string | null>(
    null
  );
  const [loading, setLoading] = useState(true);
  const [joining, setJoining] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!token) {
      setError("Invalid organization join link.");
      setLoading(false);
      return;
    }

    sessionStorage.setItem("join_token", token);

    const previewJoinLink = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await joinLinkAPI.preview(token);

        if (!response.data.is_valid) {
          setError("This organization join link is invalid or has expired.");
          return;
        }

        setOrganizationName(response.data.organization_name);
      } catch (err: unknown) {
        console.error("Failed to preview join link:", err);

        setError(
          getApiErrorMessage(
            err,
            "This organization join link is invalid or has expired."
          )
        );

        /*
         * Do not leave an invalid token behind.
         */
        sessionStorage.removeItem("join_token");
      } finally {
        setLoading(false);
      }
    };

    previewJoinLink();
  }, [token]);

  /*
   * Existing authenticated user can join immediately.
   */
  const handleJoinOrganization = async () => {
    if (!token || !user) {
      return;
    }

    setJoining(true);
    setError("");

    try {
      const response = await joinLinkAPI.join(token);

      /*
       * Refresh AuthContext so the newly-created membership
       * is available throughout the application.
       */
      const updatedUser = await fetchUser();

      if (!updatedUser) {
        setError(
          "You joined the organization, but we could not refresh your session."
        );
        return;
      }

      /*
       * Make the organization represented by this join link
       * the active organization.
       */
      const joinedOrganization = updatedUser.memberships.find(
        (membership) =>
          membership.organization_id === response.data.organization_id
      );

      if (joinedOrganization) {
        setActiveOrg(joinedOrganization);
      }

      /*
       * The token has been successfully consumed.
       */
      sessionStorage.removeItem("join_token");

      navigate("/candidate/interviews", { replace: true });
    } catch (err: unknown) {
      console.error("Failed to join organization:", err);

      setError(
        getApiErrorMessage(
          err,
          "We could not join this organization. Please try again."
        )
      );
    } finally {
      setJoining(false);
    }
  };

  /*
   * Wait for both:
   *   1. Auth state
   *   2. Join-link preview
   */
  if (authLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-sm text-muted-foreground">
          Checking organization join link...
        </div>
      </div>
    );
  }

  if (error && !organizationName) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background p-4">
        <div className="w-full max-w-md rounded-xl border border-border bg-card p-6 text-center shadow-sm">
          <h1 className="text-xl font-semibold text-card-foreground">
            Invalid Join Link
          </h1>

          <p className="mt-2 text-sm text-muted-foreground">
            {error}
          </p>

          <button
            type="button"
            onClick={() => navigate("/")}
            className="mt-6 rounded-lg bg-primary px-5 py-2 text-sm font-medium text-primary-foreground hover:opacity-90 transition-opacity"
          >
            Go Home
          </button>
        </div>
      </div>
    );
  }

  if (!organizationName) {
    return null;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="w-full max-w-md rounded-xl border border-border bg-card p-6 sm:p-8 shadow-sm">
        <div className="text-center">
          <h1 className="text-2xl font-semibold tracking-tight text-card-foreground">
            Join {organizationName}
          </h1>

          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
            You've been invited to join this organization as a candidate.
          </p>
        </div>

        {error && (
          <div className="mt-5 rounded-md border border-destructive/20 bg-destructive/10 p-3 text-center text-xs font-medium text-destructive">
            {error}
          </div>
        )}

        {user ? (
          <div className="mt-6 space-y-4">
            <div className="rounded-lg border border-border bg-muted/30 p-4">
              <p className="text-xs text-muted-foreground">
                You're signed in as
              </p>

              <p className="mt-1 text-sm font-medium text-foreground">
                {user.email}
              </p>
            </div>

            <button
              type="button"
              onClick={handleJoinOrganization}
              disabled={joining}
              className="w-full rounded-lg bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {joining ? "Joining organization..." : "Join Organization"}
            </button>
          </div>
        ) : (
          <div className="mt-6 space-y-3">
            <button
              type="button"
              onClick={() => navigate("/signup")}
              className="w-full rounded-lg bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90"
            >
              Create Account
            </button>

            <button
              type="button"
              onClick={() => navigate("/login")}
              className="w-full rounded-lg border border-border bg-background px-5 py-2.5 text-sm font-medium text-foreground transition-colors hover:bg-muted/50"
            >
              Log In
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default JoinPage;

