
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import { useAuth } from "@/hooks/useAuth";
import { joinLinkAPI } from "@/features/joinLink/joinLinkAPI";

interface JoinLinkPreview {
  organization_name: string;
  is_valid: boolean;
}

export const JoinPage: React.FC = () => {
  const navigate = useNavigate();
  const { token } = useParams<{ token: string }>();

  const { user } = useAuth();

  const [organization, setOrganization] =
    useState<JoinLinkPreview | null>(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!token) {
      setError("Invalid join link.");
      setLoading(false);
      return;
    }

    // Preserve the token so it survives navigation
    // through signup/login.
    sessionStorage.setItem("join_token", token);

    const previewJoinLink = async () => {
      try {
        const response = await joinLinkAPI.preview(token);

        setOrganization(response.data);
      } catch (err) {
        console.error("Failed to preview join link", err);

        setError(
          "This join link is invalid, inactive, or has expired."
        );
      } finally {
        setLoading(false);
      }
    };

    previewJoinLink();
  }, [token]);

  if (loading) {
    return (
      <div>
        <h1>Checking join link...</h1>
      </div>
    );
  }

  if (error || !organization) {
    return (
      <div>
        <h1>Invalid Join Link</h1>
        <p>
          {error ||
            "This join link is no longer available."}
        </p>
      </div>
    );
  }

  if (user) {
    return (
      <div>
        <h1>
          Join {organization.organization_name}
        </h1>

        <p>
          You're currently signed in as{" "}
          <strong>{user.email}</strong>.
        </p>

        <p>
          You can join this organization as a candidate.
        </p>

        <button
          onClick={() => {
            // Join action will be implemented next.
            console.log("Join organization:", token);
          }}
        >
          Join Organization
        </button>
      </div>
    );
  }

  return (
    <div>
      <h1>
        Join {organization.organization_name}
      </h1>

      <p>
        You've been invited to join this organization
        as a candidate.
      </p>

      <p>
        Create a Sorout account or log in to join.
      </p>

      <button
        onClick={() => {
          navigate("/signup");
        }}
      >
        Create Account
      </button>

      <button
        onClick={() => {
          navigate("/login");
        }}
      >
        Log In
      </button>
    </div>
  );
};

export default JoinPage;

