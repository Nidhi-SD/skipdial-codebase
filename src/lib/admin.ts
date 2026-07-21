// Admin configuration — role-based check against User.role.
// Only users whose role is "admin" can create / edit / delete blog posts.
export function isAdmin(role?: string | null): boolean {
  return role === "admin";
}
