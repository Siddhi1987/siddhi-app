import Link from 'next/link';
import { useEffect, useState } from 'react';
import { isSupabaseConfigured, supabase } from '../lib/supabaseClient';

const PLAN = {
  id: 'monthly-499',
  name: 'SiddhiAI 30-Day Access',
  price: 499,
  durationDays: 30,
};

const getDisplayName = (user) => {
  const metadata = user?.user_metadata || {};
  return metadata.full_name || metadata.name || metadata.display_name || user?.email?.split('@')?.[0] || '';