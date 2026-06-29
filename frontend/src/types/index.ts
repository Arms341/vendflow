// JARVIS App — Shared TypeScript types  v2.0.0
// All API response shapes and domain models live here.
// AI-generated pages import from this file — never redefine types inline.
//
// v2.0.0: DEBT #22 fix — User has is_active boolean (matches backend
//         models/base.py User.is_active column).

// ── Auth ──────────────────────────────────────────────────────────────────────

export type UserRole = 'admin' | 'agent' | 'user';
export type UserStatus = 'active' | 'pending_approval' | 'inactive';

export interface User {
  id: number;
  email: string;
  full_name: string;
  role: UserRole;
  status: UserStatus;
  is_active: boolean;
  created_at: string;
  updated_at?: string;
}

export interface TokenResponse {
  access_token: string;
  token_type: string;
}

export interface LoginInput {
  username: string; // FastAPI OAuth2 uses 'username' not 'email'
  password: string;
}

export interface RegisterInput {
  email: string;
  password: string;
  full_name: string;
  [key: string]: unknown; // domain-specific fields added by AI
}

// ── Company / Branding ────────────────────────────────────────────────────────

export interface Company {
  id?: number;
  company_name: string;
  logo_url?: string | null;
  primary_color: string;
  secondary_color?: string;
  phone?: string;
  email?: string;
  website?: string;
  address?: string;
  tagline?: string;
  disclaimer_text?: string;
}

// ── Pagination ────────────────────────────────────────────────────────────────

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  size: number;
  pages: number;
}

// ── API Error ─────────────────────────────────────────────────────────────────

export interface ApiError {
  detail: string | { msg: string; type: string }[];
  status_code?: number;
}

// ── Utility ───────────────────────────────────────────────────────────────────

export function getErrorMessage(err: unknown): string {
  if (!err) return 'An unknown error occurred';
  const e = err as { response?: { data?: ApiError }; message?: string };
  const detail = e.response?.data?.detail;
  if (typeof detail === 'string') return detail;
  if (Array.isArray(detail)) return detail.map((d: any) => d.msg).join(', ');
  return e.message ?? 'An unknown error occurred';
}

// ── Contract-first entities (re-exported from ./api, FSB v1.17.0) ──
// Authoritative shapes derived from the backend's own /openapi.json.
export type { Alert as AlertResponse } from './api';
export type { Alert } from './api';
export type { Analytics as AnalyticsResponse } from './api';
export type { Analytics } from './api';
export type { DailyReport as DailyReportResponse } from './api';
export type { DailyReport } from './api';
export type { EmailSendLog as EmailSendLogResponse } from './api';
export type { EmailSendLog } from './api';
export type { EmailSequence as EmailSequenceResponse } from './api';
export type { EmailSequence } from './api';
export type { InventoryItem as InventoryItemResponse } from './api';
export type { InventoryItem } from './api';
export type { Lead as LeadResponse } from './api';
export type { Lead } from './api';
export type { Location as LocationResponse } from './api';
export type { Location } from './api';
export type { Machine as MachineResponse } from './api';
export type { Machine } from './api';
export type { MarketingTemplate as MarketingTemplateResponse } from './api';
export type { MarketingTemplate } from './api';
export type { Operator as OperatorResponse } from './api';
export type { Operator } from './api';
export type { OperatorWebsite as OperatorWebsiteResponse } from './api';
export type { OperatorWebsite } from './api';
export type { Product as ProductResponse } from './api';
export type { Product } from './api';
export type { Proposal as ProposalResponse } from './api';
export type { Proposal } from './api';
export type { Route as RouteResponse } from './api';
export type { Route } from './api';
export type { ServiceVisit as ServiceVisitResponse } from './api';
export type { ServiceVisit } from './api';
export type { Transaction as TransactionResponse } from './api';
export type { Transaction } from './api';

// ── Domain entities (auto-derived from backend response schemas, FSB v1.14.0) ──
// AI-generated pages import these — never clone `User` for domain data.

export interface Token {
  access_token: string;
  token_type: string;
  expires_in?: number | null;
}

// ── Response aliases (FSB v1.21.0) ──
// <Entity>Response === <Entity>; AI pages import either name.
export type TokenResponseAlias = Token;