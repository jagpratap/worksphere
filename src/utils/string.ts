/**
 * Limits the initials to 2 characters to fit the avatar (e.g. "John Michael Smith" → "JM").
 * @param name - The name to get the initials of.
 * @returns The initials of the name.
 */
export function getInitials(name: string): string {
  return name
    .split(" ")
    .map(part => part[0])
    .join("")
    .toUpperCase()
    .slice(0, 2) || "?";
}
