export function Logo({ className }: { className?: string }) {
  return (
    <div className={className}>
      <svg
        width="32"
        height="32"
        viewBox="0 0 32 32"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path d="M6.66669 16L12.6667 22L25.3334 9.33333" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"/>
        <title>Taskify Logo</title>
      </svg>
    </div>
  );
}
