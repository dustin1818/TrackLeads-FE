import { useEffect, useMemo, useState } from "react";

interface CompanyLogoProps {
  companyName: string;
  domain?: string;
  logoUrl?: string;
  className?: string;
}

const normalizeDomain = (value?: string) => {
  if (!value) {
    return "";
  }

  return value
    .replace(/^https?:\/\//i, "")
    .replace(/^www\./i, "")
    .split("/")[0]
    .trim()
    .toLowerCase();
};

const getInitials = (companyName: string) => {
  const parts = companyName
    .split(/\s+/)
    .map((part) => part.trim())
    .filter(Boolean)
    .slice(0, 2);

  if (!parts.length) {
    return "LG";
  }

  return parts.map((part) => part[0]?.toUpperCase() || "").join("");
};

export const CompanyLogo = ({
  companyName,
  domain,
  logoUrl,
  className = "h-12 w-12",
}: CompanyLogoProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const logoSources = useMemo(() => {
    const normalizedDomain = normalizeDomain(domain);
    const websiteUrl = normalizedDomain ? `https://${normalizedDomain}` : "";

    return Array.from(
      new Set(
        [
          logoUrl,
          normalizedDomain
            ? `https://logo.clearbit.com/${normalizedDomain}`
            : "",
          normalizedDomain ? `https://icon.horse/icon/${normalizedDomain}` : "",
          websiteUrl
            ? `https://www.google.com/s2/favicons?sz=128&domain_url=${encodeURIComponent(websiteUrl)}`
            : "",
        ].filter(Boolean),
      ),
    );
  }, [domain, logoUrl]);

  useEffect(() => {
    setCurrentIndex(0);
  }, [logoSources]);

  const activeLogo = logoSources[currentIndex];

  if (!activeLogo) {
    return (
      <div
        className={`${className} grid place-items-center rounded-lg bg-slate-100 text-sm font-semibold text-slate-500`}
        aria-label={`${companyName} logo placeholder`}
      >
        {getInitials(companyName)}
      </div>
    );
  }

  return (
    <div
      className={`${className} overflow-hidden rounded-lg bg-white ring-1 ring-slate-200`}
    >
      <img
        src={activeLogo}
        alt={`${companyName} logo`}
        className="h-full w-full object-contain bg-white p-1.5"
        loading="lazy"
        referrerPolicy="no-referrer"
        onError={() => {
          if (currentIndex < logoSources.length - 1) {
            setCurrentIndex((index) => index + 1);
          } else {
            setCurrentIndex(logoSources.length);
          }
        }}
      />
    </div>
  );
};
