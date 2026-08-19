import api from "@/api/axios";

export interface JoinLinkPreview {
  organization_name: string;
  is_valid: boolean;
}

export interface JoinOrganizationResponse {
  status: "joined" | "already_member";
  organization_id: number;
  organization_name: string;
  role: string;
}

export const joinLinkAPI = {
  preview: (token: string) =>
    api.get<JoinLinkPreview>(
      `/join-links/${token}/preview`
    ),

  join: (token: string) =>
    api.post<JoinOrganizationResponse>(
      `/join-links/${token}`
    ),
};