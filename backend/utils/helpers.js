
export function getPagination(query = {}) {
  const page = parseInt(query.page, 10) || 1;
  const limit = Math.min(parseInt(query.limit, 10) || 10, 100);
  const offset = (page - 1) * limit;
  return { page, limit, offset };
}

export function pick(obj, allowedKeys = []) {
  return Object.fromEntries(
    Object.entries(obj).filter(([key]) => allowedKeys.includes(key))
  );
}

export function isAdmin(user) {
  return user?.role === 'SYSTEM_ADMIN';
}

export function isOwner(user, resourceOwnerId) {
  return user?.id === resourceOwnerId;
}
