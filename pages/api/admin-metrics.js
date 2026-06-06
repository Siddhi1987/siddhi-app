import { isSupabaseAdminConfigured, supabaseAdmin } from "../../lib/supabaseAdmin";

const FOUNDER_EMAIL = "paraggokhale1987@gmail.com";

async function countRows(tableName, applyFilters) {
  let query = supabaseAdmin.from(tableName).select("*", { count: "exact", head: true });

  if (applyFilters) {
    query = applyFilters(query);
  }

  const { count, error } = await query;

  if (error) {
    return { count: 0, error: error.message };
  }

  return { count: count || 0, error: null };
}

async function countAuthUsers() {
  let page = 1;
  let total = 0;
  const perPage = 1000;

  while (true) {
    const { data, error } = await supabaseAdmin.auth.admin.listUsers({
      page,
      perPage,
    });

    if (error) {
      return { count: 0, error: error.message };
    }

    const users = data?.users || [];
    total += users.length;

    if (users.length < perPage) {
      break;
    }

    page += 1;
  }

  return { count: total, error: null };
}

function formatSubscriptionRevenue(subscriptions) {
  return subscriptions.reduce((sum, subscription) => sum + Number(subscription.amount || 0), 0);
}

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  if (!isSupabaseAdminConfigured) {
    return res.status(500).json({ message: "Supabase admin is not configured" });
  }

  const token = req.headers.authorization?.replace(/^Bearer\s+/i, "");

  if (!token) {
    return res.status(401).json({ message: "Founder login required" });
  }

  const {
    data: { user },
    error: userError,
  } = await supabaseAdmin.auth.getUser(token);

  if (userError || !user) {
    return res.status(401).json({ message: "Invalid Supabase session" });
  }

  if ((user.email || "").toLowerCase() !== FOUNDER_EMAIL) {
    return res.status(403).json({ message: "Founder access only" });
  }

  const now = new Date().toISOString();
  const errors = [];

  const [
    totalUsersResult,
    readinessProfilesResult,
    communicationReportsResult,
    activeSubscriptionsResult,
    subscriptionsResult,
  ] = await Promise.all([
    countAuthUsers(),
    countRows("readiness_profiles"),
    countRows("communication_reports"),
    countRows("subscriptions", (query) =>
      query.eq("status", "active").gt("current_period_end", now)
    ),
    supabaseAdmin
      .from("subscriptions")
      .select("user_id,amount,status,current_period_end,created_at"),
  ]);

  [
    ["totalUsers", totalUsersResult.error],
    ["readinessProfiles", readinessProfilesResult.error],
    ["communicationReports", communicationReportsResult.error],
    ["activeSubscriptions", activeSubscriptionsResult.error],
    ["subscriptions", subscriptionsResult.error?.message],
  ].forEach(([source, error]) => {
    if (error) {
      errors.push({ source, message: error });
    }
  });

  const subscriptions = subscriptionsResult.data || [];
  const paidUsers = new Set(subscriptions.map((subscription) => subscription.user_id).filter(Boolean)).size;
  const revenuePaise = formatSubscriptionRevenue(subscriptions);

  const metrics = {
    totalUsers: totalUsersResult.count,
    readinessProfilesSubmitted: readinessProfilesResult.count,
    interviewsCompleted: communicationReportsResult.count,
    communicationReportsGenerated: communicationReportsResult.count,
    paidUsers,
    activeSubscriptions: activeSubscriptionsResult.count,
    revenuePaise,
    revenueInr: revenuePaise / 100,
    conversionFunnel: [
      {
        key: "visitor",
        label: "Visitor",
        value: null,
        note: "Visitor analytics are not tracked in the existing Supabase tables yet.",
      },
      {
        key: "login",
        label: "Login",
        value: totalUsersResult.count,
      },
      {
        key: "assessment",
        label: "Assessment",
        value: readinessProfilesResult.count,
      },
      {
        key: "report",
        label: "Report",
        value: communicationReportsResult.count,
      },
      {
        key: "payment",
        label: "Payment",
        value: paidUsers,
      },
    ],
    notes: [
      "Interviews completed are counted from communication_reports because the current schema stores a report when an authenticated interview session completes.",
      "Visitor counts need analytics instrumentation before they can be measured from Supabase.",
    ],
    generatedAt: new Date().toISOString(),
  };

  return res.status(200).json({
    founderEmail: user.email,
    metrics,
    errors,
  });
}
