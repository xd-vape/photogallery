import "server-only";
import { email } from "zod";
import { getPlanLabel, getRoleLabel, isAdmin } from "../auth/permissions";

export function toSidebarUserDto(user) {
  return {
    name: user.name,
    email: user.email,
    isAdmin: isAdmin(user),
    roleLabel: getRoleLabel(user),
    planLabel: getPlanLabel(user.subscriptionPlan),
  };
}
