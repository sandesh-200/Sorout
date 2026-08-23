import api from "@/api/axios";
import type { 
  JoinLinkItem, 
  JoinLinkPreview, 
  JoinOrganizationResponse 
} from "./joinLinkTypes";

export const joinLinkAPI = {
  preview: (token: string) =>
    api.get<JoinLinkPreview>(`/join-links/${token}/preview`),

  join: (token: string) =>
    api.post<JoinOrganizationResponse>(`/join-links/${token}`),
};

export const adminJoinLinkAPI = {
  createJoinLink: (orgId: number, data: { expires_at?: string } = {}) =>
    api.post<JoinLinkItem>(`/admin/join-links/${orgId}`, data),

  getJoinLinks: (orgId: number) =>
    api.get<JoinLinkItem[]>(`/admin/join-links/${orgId}`),

  deactivateJoinLink: (orgId: number, linkId: number) =>
    api.delete(`/admin/join-links/${orgId}/${linkId}`),
};