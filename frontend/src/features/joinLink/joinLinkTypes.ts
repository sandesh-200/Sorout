// Domain Models & Redux State
export interface JoinLinkItem {
  id: number;
  organization_id: number;
  token?: string | null;
  expires_at: string | null;
  is_active: boolean;
  created_at: string;
}

export interface AdminJoinLinkState {
  joinLinks: JoinLinkItem[];
  loading: boolean;
  error: string | null;
}

// API Endpoint DTOs
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