export const replaceLod = (
  url: string | null,
  lod: 'LOW' | 'MEDIUM' | 'HIGH'
): string | null => {
  if (url == null) return null;

  try {
    const u = new URL(url);
    u.pathname = u.pathname.replace(
      /\/(ORIGINAL|LOW|MEDIUM|HIGH)\//,
      `/${lod}/`
    );
    return u.toString();
  } catch {
    return url;
  }
};
