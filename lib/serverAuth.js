import { isSupabaseAdminConfigured, supabaseAdmin } from './supabaseAdmin';

export const getBearerToken = (req) => {
  const authorization = String(req.headers.authorization || '');
  const [scheme, token] = authorization.split(' ');

  if (scheme?.toLowerCase() !== 'bearer' || !token) return '';
  return token.trim();
};

export const getAuthenticatedUser = async (req) => {
  if (!isSupabaseAdminConfigured || !supabaseAdmin) {
    return {
      user: null,
      error: 'Supabase admin is not configured',
      status: 500,
    };
  }

  const token = getBearerToken(req);
  if (!token) {
    return {
      user: null,
      error: 'Authentication required',
      status: 401,
    };
  }

  const { data, error } = await supabaseAdmin.auth.getUser(token);
  const user = data?.user || null;

  if (error || !user) {
    return {
      user: null,
      error: 'Invalid or expired session',
      status: 401,
    };
  }

  return { user, error: '', status: 200 };
};
