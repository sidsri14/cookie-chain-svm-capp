import { COOK_DECIMALS } from './cookie-chain';

/** Native balances are returned in 1e-9 base units (same as lamports → SOL). */
export function lamportsToCook(lamports: number | bigint): number {
  return Number(lamports) / 10 ** COOK_DECIMALS;
}

export function formatCook(
  lamports: number | bigint | null | undefined,
  decimals = 6,
): string {
  if (lamports === null || lamports === undefined) return '—';
  const value = lamportsToCook(lamports);
  return value.toLocaleString('en-US', {
    minimumFractionDigits: 0,
    maximumFractionDigits: decimals,
  });
}

export function formatSlot(slot: number): string {
  return slot.toLocaleString('en-US');
}

export function formatRelativeTime(timestampMs: number): string {
  const seconds = Math.floor((Date.now() - timestampMs) / 1000);
  if (Number.isNaN(seconds) || seconds < 0) return 'just now';
  if (seconds < 60) return 'just now';
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

export function formatClockTime(timestampMs: number): string {
  const d = new Date(timestampMs);
  if (Number.isNaN(d.getTime())) return '';
  return d.toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  });
}
