export function getDocumentId(rawId) {
  if (!rawId) return null

  const parts = rawId.split('.')

  return parts.length === 1 ? parts[0] : parts[1]
}
