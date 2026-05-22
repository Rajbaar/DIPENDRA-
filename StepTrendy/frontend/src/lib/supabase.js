import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
  },
  realtime: {
    params: {
      eventsPerSecond: 10,
    },
  },
});

// Admin client with service role (server-side only)
export const supabaseAdmin = typeof window === 'undefined'
  ? createClient(supabaseUrl, process.env.SUPABASE_SERVICE_ROLE_KEY, {
      auth: { autoRefreshToken: false, persistSession: false },
    })
  : null;

// Realtime subscriptions
export function subscribeToTable(table, filter, callback) {
  return supabase
    .channel(`public:${table}`)
    .on('postgres_changes', { event: '*', schema: 'public', table, filter }, (payload) => {
      callback(payload);
    })
    .subscribe();
}

export function subscribeToProduct(productId, callback) {
  return subscribeToTable('products', { id: `eq.${productId}` }, callback);
}

export function subscribeToOrders(userId, callback) {
  return subscribeToTable('orders', { user_id: `eq.${userId}` }, callback);
}

export function subscribeToAdminUpdates(callback) {
  return supabase
    .channel('admin-channel')
    .on('postgres_changes', { event: '*', schema: 'public' }, callback)
    .subscribe();
}
