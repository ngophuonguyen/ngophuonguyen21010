export function CatMark({ size = 38 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 40 40"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M9 17 7 5l12 8h3L33 5l-2 13c3 5 2 13-3 16-5 4-13 3-17-1-4-4-5-10-2-16Z"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinejoin="round"
      />
      <path
        d="M13 21h1m12 0h1m-10 5 3 2 3-2m-3 2v3m-9-5-6-1m6 5-5 2m23-6 6-1m-6 5 5 2"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
      />
    </svg>
  );
}
export default function BrandLogo() {
  return (
    <>
      <span className="cat-mark">
        <CatMark />
      </span>
      <span className="signature-lockup">
        <strong className="signature-name">Ngô Phương Uyên</strong>
        <span className="brand-caption">DEUTSCH STUDIO</span>
      </span>
    </>
  );
}
