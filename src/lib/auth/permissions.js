export const USER_ROLES = {
  USER: "user",
  ADMIN: "admin",
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
  [USER_ROLES.USER]: "User",
  [USER_ROLES.ADMIN]: "Admin",
};

export const PLAN_LABELS = {
  FREE: "Free",
  PRO: "Pro",
  STUDIO: "Studio",
  ENTERPRISE: "Enterprise",
};

function normalizeRoleValue(userOrRole) {
  const value = typeof userOrRole === "string" ? userOrRole : userOrRole?.role;

  return typeof value === "string" ? value : "";
}

export function getUserRoles(userOrRole) {
  return normalizeRoleValue(userOrRole)
    .split(",")
    .map((role) => role.trim())
    .filter(Boolean);
}

export function hasRole(userOrRole, role) {
  return getUserRoles(userOrRole).includes(role);
}

export function isAdmin(userOrRole) {
  return hasRole(userOrRole, USER_ROLES.ADMIN);
}

export function canManageGalleries(user) {
  if (!user?.id) {
    return false;
  }

  return hasRole(user, USER_ROLES.USER) || hasRole(user, USER_ROLES.ADMIN);
}

export function hasActiveSubscription(user) {
  return [
    SUBSCRIPTION_STATUSES.TRIALING,
    SUBSCRIPTION_STATUSES.ACTIVE,
  ].includes(user?.subscriptionStatus);
}

export function getRoleLabel(userOrRole) {
  return isAdmin(userOrRole)
    ? ROLE_LABELS[USER_ROLES.ADMIN]
    : ROLE_LABELS[USER_ROLES.USER];
}

export function getPlanLabel(plan) {
  return PLAN_LABELS[plan] || PLAN_LABELS.FREE;
}
