export const USER_ROLES = {
  OWNER: "OWNER",
  ADMIN: "ADMIN",
  PHOTOGRAPHER: "PHOTOGRAPHER",
  VIEWER: "VIEWER",
};

export const SUBSCRIPTION_PLANS = {
  FREE: "FREE",
  PRO: "PRO",
  STUDIO: "STUDIO",
  ENTERPRISE: "ENTERPRISE",
};

export const SUBSCRIPTION_STATUSES = {
  NONE: "NONE",
  TRIALING: "TRIALING",
  ACTIVE: "ACTIVE",
  PAST_DUE: "PAST_DUE",
  CANCELED: "CANCELED",
};

export const ROLE_LABELS = {
  OWNER: "Owner",
  ADMIN: "Admin",
  PHOTOGRAPHER: "Photographer",
  VIEWER: "Viewer",
};

export const PLAN_LABELS = {
  FREE: "Free",
  PRO: "Pro",
  STUDIO: "Studio",
  ENTERPRISE: "Enterprise",
};

export function canManageGalleries(user) {
  return [USER_ROLES.OWNER, USER_ROLES.ADMIN, USER_ROLES.PHOTOGRAPHER].includes(
    user?.role,
  );
}

export function hasActiveSubscription(user) {
  return [SUBSCRIPTION_STATUSES.TRIALING, SUBSCRIPTION_STATUSES.ACTIVE].includes(
    user?.subscriptionStatus,
  );
}

export function getRoleLabel(role) {
  return ROLE_LABELS[role] || ROLE_LABELS.OWNER;
}

export function getPlanLabel(plan) {
  return PLAN_LABELS[plan] || PLAN_LABELS.FREE;
}
