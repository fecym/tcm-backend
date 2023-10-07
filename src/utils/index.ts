export function isEmpty(value) {
  if (Array.isArray(value)) return value.length === 0;
  return value === null || value === undefined || value == '';
}

export function getDuplicateName(str) {
  const regex = /'([^']+)'/;
  const match = str.match(regex);
  return match?.[1] ?? '';
}

export function genWhere(qb, query, queryBuilder, keys = [], isLike = false) {
  if (isLike) return genLikeWhere(qb, query, queryBuilder, keys);
  const excludeKeys = ['page', 'size'];
  keys.forEach((key) => {
    if (!excludeKeys.includes(key) && !isEmpty(query[key])) {
      // qb.where('user.email = :email', { email: 'query.email' });
      qb.where(`${queryBuilder}.${key} = :${key}`, { [key]: query[key] });
    }
  });
}

export function genLikeWhere(qb, query, queryBuilder, keys = []) {
  keys.forEach((key) => {
    if (!isEmpty(query[key])) {
      qb.where(`${queryBuilder}.${key} LIKE :${key}`, { [key]: query[key] });
    }
  });
}
