export function getSessionActiveOrgId(session: any): string {
  const orgId = session?.activeOrganizationId;
  if (!orgId) throw new Error("Missing organization context");
  return orgId;
}
