const MONTHS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];

/**
 * PUBLIC_INTERFACE
 * Format an ISO date string into a readable short form like "Jan 5, 2025".
 * If the input is invalid, returns an empty string.
 */
export function format(iso) {
  try {
    const d = new Date(iso);
    if (Number.isNaN(d.getTime())) return '';
    const m = MONTHS[d.getMonth()];
    const day = d.getDate();
    const y = d.getFullYear();
    if (!m || Number.isNaN(day) || Number.isNaN(y)) return '';
    // Use classic string concatenation to avoid any template literal parsing issues.
    return m + ' ' + day + ', ' + y;
  } catch (e) {
    return '';
  }
}

export default { format };
