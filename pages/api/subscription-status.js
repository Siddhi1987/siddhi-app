import { getAuthenticatedUser } from '../../lib/serverAuth';
import { supabaseAdmin } from '../../lib/supabaseAdmin';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const auth = await getAuthenticatedUser(req);
  if (!auth.user) {
    return res.status(auth.status).json({ active: false, message: auth.error });
  }

  const now = new Date().toISOString();
  const { data, error } = await supabaseAdmin
    .from('subscriptions')
    .select('status,plan,current_period_start,current_period_end')
    .eq('user_id', auth.user.id)
    .eq('status', 'active')
    .gt('current_period_end', now)
    .order('current_period_end', { ascending: false })
    .limit(1)
    .maybeSingle();

  if (error) {
    console.error('Subscription status lookup failed:', error);
    return res.status(500).json({ active: false, message: 'Unable to verify subscription' });
  }

  return res.status(200).json({
    active: Boolean(data),
    subscription: data || null,
  });
}
