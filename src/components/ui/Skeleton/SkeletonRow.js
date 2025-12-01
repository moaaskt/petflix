import './Skeleton.css';

export function SkeletonRow({ count = 6 } = {}) {
  const items = Array.from({ length: count }).map(() => '<div class="skeleton-card"></div>').join('');
  return `
    <div class="skeleton-row">
      ${items}
    </div>
  `;
}

