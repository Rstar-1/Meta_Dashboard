import React, { useState, useCallback, useMemo, useEffect, useRef } from "react";
import Icon from "../../components/common/Icon";
import Fields from "../../components/forms/Fields";
import Button from "../../components/common/Button";
import { showToast } from "../../components/common/Toast";
import { useDomain } from "../../feature/domainSlice";
import Container from "../../components/common/Container";

// Static extension lists exactly matching the reference UI
const EXTENSION_LIST_LEFT = [".in", ".io", ".co", ".org", ".dev", ".tech", ".store"];
const EXTENSION_LIST_RIGHT = [".co.in", ".ai", ".net", ".app", ".xyz", ".online"];

// Suggested prefixes for domain idea generation
const IDEA_PREFIXES_LEFT = ["get", "use", "my"];
const IDEA_PREFIXES_RIGHT = ["try", "go", "join"];

/**
 * Status Badge Component for RDAP Verification
 */
const StatusBadge = React.memo(({ status, isLoading, onCheck }) => {
  if (isLoading) {
    return (
      <span
        className="mini-text inline-flex items-center gap-4 select-none"
        style={{ fontSize: "11.5px", color: "#64748b" }}
      >
        <span
          className="inline-block"
          style={{
            width: "10px",
            height: "10px",
            border: "2px solid #cbd5e1",
            borderTopColor: "#2563eb",
            borderRadius: "50%",
            animation: "spin 0.8s linear infinite",
          }}
        />
        Checking...
      </span>
    );
  }

  if (status === "available") {
    return (
      <span
        className="mini-text font-600 select-none inline-flex items-center gap-4"
        style={{ color: "#10b981", fontSize: "12px" }}
      >
        <span
          style={{
            width: "6px",
            height: "6px",
            borderRadius: "50%",
            backgroundColor: "#10b981",
          }}
        />
        Available
      </span>
    );
  }

  if (status === "registered") {
    return (
      <span
        className="mini-text font-500 select-none inline-flex items-center gap-4"
        style={{ color: "#ef4444", fontSize: "12px" }}
      >
        <span
          style={{
            width: "6px",
            height: "6px",
            borderRadius: "50%",
            backgroundColor: "#ef4444",
          }}
        />
        Registered
      </span>
    );
  }

  if (status === "unsupported") {
    return (
      <span
        className="mini-text font-400 select-none"
        style={{ color: "#94a3b8", fontSize: "12px" }}
        title="RDAP not available for this TLD"
      >
        Unsupported
      </span>
    );
  }

  // Default: Unverified (matches reference screenshot)
  return (
    <button
      type="button"
      onClick={onCheck}
      className="mini-text font-400 select-none border-0 bg-transparent cursor-pointer p-0 hover:text-dark transition-colors"
      style={{ color: "#94a3b8", fontSize: "12px", background: "transparent", border: "none" }}
      title="Click to check live registration status via RDAP"
    >
      Unverified
    </button>
  );
});

StatusBadge.displayName = "StatusBadge";

/**
 * Domain Card Row Component
 * Fully memoized to prevent re-renders when other domain items change
 */
const DomainRow = React.memo(
  ({ domain, result, isLoading, isStarred, isCopied, onToggleStar, onCopy, onCheck }) => {
    const handleCheck = useCallback(() => {
      onCheck(domain);
    }, [domain, onCheck]);

    const handleCopyClick = useCallback(() => {
      onCopy(domain);
    }, [domain, onCopy]);

    const handleStarClick = useCallback(() => {
      onToggleStar(domain);
    }, [domain, onToggleStar]);

    return (
      <div
        className="bg-white rounded-8 px-16 py-12 flex items-center justify-between mb-8 transition-all hover:border-gray"
        style={{
          border: "1px solid #eef2f6",
          boxShadow: "0 1px 2px rgba(15, 23, 42, 0.02)",
        }}
      >
        <div
          className="font-600 text-dark small-text select-text"
          style={{ fontSize: "13.5px", color: "#1e293b", letterSpacing: "-0.2px" }}
        >
          {domain}
        </div>

        <div className="flex items-center gap-12">
          <StatusBadge
            status={result?.status}
            isLoading={isLoading}
            onCheck={handleCheck}
          />

          <button
            type="button"
            onClick={handleStarClick}
            className="flex items-center justify-center p-2 border-0 bg-transparent cursor-pointer transition-transform active:scale-90"
            title={isStarred ? "Remove from favorites" : "Save to favorites"}
            style={{ background: "transparent", border: "none", cursor: "pointer" }}
          >
            <Icon
              name="Star"
              width="14"
              height="14"
              stroke={isStarred ? "#f59e0b" : "#cbd5e1"}
              fill={isStarred ? "#f59e0b" : "none"}
            />
          </button>

          <button
            type="button"
            onClick={handleCopyClick}
            className="flex items-center justify-center p-2 border-0 bg-transparent cursor-pointer transition-transform active:scale-90"
            title="Copy domain name"
            style={{ background: "transparent", border: "none", cursor: "pointer" }}
          >
            <Icon
              name={isCopied ? "Check" : "CopyLink"}
              width="14"
              height="14"
              stroke={isCopied ? "#10b981" : "#94a3b8"}
            />
          </button>
        </div>
      </div>
    );
  }
);

DomainRow.displayName = "DomainRow";

/**
 * Primary Hero Domain Card (.com featured item)
 */
const PrimaryDomainCard = React.memo(
  ({
    domain,
    result,
    isLoading,
    isStarred,
    isCopied,
    onToggleStar,
    onCopy,
    onFilter,
    onCheck,
  }) => {
    return (
      <div
        className="bg-white rounded-10 p-20 mb-14 flex items-center justify-between"
        style={{
          border: "1px solid #e2e8f0",
          boxShadow: "0 2px 4px rgba(15, 23, 42, 0.03)",
        }}
      >
        <div>
          <h3
            className="headpara-text font-700 text-dark"
            style={{
              fontSize: "20px",
              fontWeight: "700",
              margin: 0,
              lineHeight: 1.2,
              color: "#0f172a",
              letterSpacing: "-0.3px",
            }}
          >
            {domain}
          </h3>
          <div className="mt-4">
            <StatusBadge
              status={result?.status}
              isLoading={isLoading}
              onCheck={() => onCheck(domain)}
            />
          </div>
        </div>

        <div className="flex items-center gap-8">
          <Button
            version="icon"
            variant="outline"
            bg="transparent"
            color="gray"
            onClick={onFilter}
            title="Filter domains"
            style={{
              border: "1px solid #e2e8f0",
              borderRadius: "6px",
              width: "32px",
              height: "32px",
              padding: 0,
            }}
          >
            <Icon name="Filter" width="13" height="13" stroke="#64748b" />
          </Button>

          <Button
            version="icon"
            variant="outline"
            bg="transparent"
            color="gray"
            onClick={() => onCopy(domain)}
            title="Copy primary domain"
            style={{
              border: "1px solid #e2e8f0",
              borderRadius: "6px",
              width: "32px",
              height: "32px",
              padding: 0,
            }}
          >
            <Icon
              name={isCopied ? "Check" : "CopyLink"}
              width="13"
              height="13"
              stroke={isCopied ? "#10b981" : "#64748b"}
            />
          </Button>

          <Button
            version="icon"
            variant="outline"
            bg="transparent"
            color="gray"
            onClick={() => onToggleStar(domain)}
            title="Favorite primary domain"
            style={{
              border: "1px solid #e2e8f0",
              borderRadius: "6px",
              width: "32px",
              height: "32px",
              padding: 0,
            }}
          >
            <Icon
              name="Star"
              width="13"
              height="13"
              stroke={isStarred ? "#f59e0b" : "#64748b"}
              fill={isStarred ? "#f59e0b" : "none"}
            />
          </Button>
        </div>
      </div>
    );
  }
);

PrimaryDomainCard.displayName = "PrimaryDomainCard";

/**
 * Main Domain Checker Page
 */
const Domain = () => {
  const {
    searchQuery,
    domainResults,
    loadingDomains,
    starredDomains,
    checkDomain,
    checkBatchDomains,
    setSearchQuery,
    toggleStarDomain,
  } = useDomain();

  const [copiedDomain, setCopiedDomain] = useState("");
  const [shareCopied, setShareCopied] = useState(false);
  const [filterMode, setFilterMode] = useState("all"); // 'all' | 'available' | 'registered' | 'starred'
  const containerRef = useRef(null);

  // Normalize search query for domain formation
  const cleanQuery = useMemo(() => {
    const raw = searchQuery.trim().toLowerCase();
    const stripped = raw.replace(/[^a-z0-9-]/g, "");
    return stripped || "nowcheck";
  }, [searchQuery]);

  const primaryDomain = `${cleanQuery}.com`;

  // Extensions column 1
  const extensionsLeft = useMemo(() => {
    return EXTENSION_LIST_LEFT.map((ext) => `${cleanQuery}${ext}`);
  }, [cleanQuery]);

  // Extensions column 2
  const extensionsRight = useMemo(() => {
    return EXTENSION_LIST_RIGHT.map((ext) => `${cleanQuery}${ext}`);
  }, [cleanQuery]);

  // Suggestions column 1
  const ideasLeft = useMemo(() => {
    return IDEA_PREFIXES_LEFT.map((prefix) => `${prefix}${cleanQuery}.com`);
  }, [cleanQuery]);

  // Suggestions column 2
  const ideasRight = useMemo(() => {
    return IDEA_PREFIXES_RIGHT.map((prefix) => `${prefix}${cleanQuery}.com`);
  }, [cleanQuery]);

  // Check domain via RDAP API
  const handleCheckDomain = useCallback(
    (domain) => {
      checkDomain(domain);
    },
    [checkDomain]
  );

  // Check all visible domains via batch RDAP
  const handleCheckAll = useCallback(() => {
    const allDomains = [
      primaryDomain,
      ...extensionsLeft,
      ...extensionsRight,
      ...ideasLeft,
      ...ideasRight,
    ];
    checkBatchDomains(allDomains);
    if (typeof showToast === "function") {
      showToast("Checking live RDAP status for domains...", "info");
    }
  }, [
    primaryDomain,
    extensionsLeft,
    extensionsRight,
    ideasLeft,
    ideasRight,
    checkBatchDomains,
  ]);

  // Auto-check primary domain on debounced query change
  useEffect(() => {
    const timer = setTimeout(() => {
      if (cleanQuery && !domainResults[primaryDomain]) {
        checkDomain(primaryDomain);
      }
    }, 600);
    return () => clearTimeout(timer);
  }, [cleanQuery, primaryDomain, domainResults, checkDomain]);

  // Focus input helper
  const focusInput = useCallback(() => {
    const inputEl = containerRef.current?.querySelector("input");
    inputEl?.focus();
  }, []);

  // Handlers wrapped with useCallback
  const handleSearchChange = useCallback(
    (val) => {
      setSearchQuery(typeof val === "string" ? val : val?.target?.value || "");
    },
    [setSearchQuery]
  );

  const handleClear = useCallback(() => {
    setSearchQuery("");
    focusInput();
  }, [setSearchQuery, focusInput]);

  const handleToggleStar = useCallback(
    (domain) => {
      toggleStarDomain(domain);
    },
    [toggleStarDomain]
  );

  const handleCopy = useCallback((domain) => {
    if (navigator?.clipboard) {
      navigator.clipboard.writeText(domain);
    }
    setCopiedDomain(domain);
    if (typeof showToast === "function") {
      showToast(`Copied ${domain} to clipboard!`, "success");
    }
    setTimeout(() => {
      setCopiedDomain((curr) => (curr === domain ? "" : curr));
    }, 2000);
  }, []);

  const handleShare = useCallback(() => {
    const shareUrl = window.location.href;
    if (navigator?.clipboard) {
      navigator.clipboard.writeText(shareUrl);
    }
    setShareCopied(true);
    if (typeof showToast === "function") {
      showToast("Search link copied to clipboard!", "success");
    }
    setTimeout(() => setShareCopied(false), 2000);
  }, []);

  const handleFilter = useCallback(() => {
    setFilterMode((prev) => {
      if (prev === "all") return "available";
      if (prev === "available") return "registered";
      if (prev === "registered") return "starred";
      return "all";
    });
    const nextMode =
      filterMode === "all"
        ? "Available only"
        : filterMode === "available"
          ? "Registered only"
          : filterMode === "registered"
            ? "Starred only"
            : "All domains";
    if (typeof showToast === "function") {
      showToast(`Filter: ${nextMode}`, "info");
    }
  }, [filterMode]);

  // Filtering filter predicate
  const matchesFilter = useCallback(
    (domain) => {
      if (filterMode === "all") return true;
      if (filterMode === "starred") return starredDomains.includes(domain);
      const res = domainResults[domain];
      if (filterMode === "available") return res?.status === "available";
      if (filterMode === "registered") return res?.status === "registered";
      return true;
    },
    [filterMode, starredDomains, domainResults]
  );

  // Filtered lists
  const filteredExtLeft = useMemo(
    () => extensionsLeft.filter(matchesFilter),
    [extensionsLeft, matchesFilter]
  );
  const filteredExtRight = useMemo(
    () => extensionsRight.filter(matchesFilter),
    [extensionsRight, matchesFilter]
  );
  const filteredIdeasLeft = useMemo(
    () => ideasLeft.filter(matchesFilter),
    [ideasLeft, matchesFilter]
  );
  const filteredIdeasRight = useMemo(
    () => ideasRight.filter(matchesFilter),
    [ideasRight, matchesFilter]
  );

  // Keyboard shortcut '/' to focus search bar
  useEffect(() => {
    const handleKeyDown = (e) => {
      const activeEl = document.activeElement;
      const isInputFocused = activeEl && activeEl.tagName === "INPUT";
      if (e.key === "/" && !isInputFocused) {
        e.preventDefault();
        focusInput();
      } else if (e.key === "Enter" && isInputFocused) {
        handleCopy(primaryDomain);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [primaryDomain, handleCopy, focusInput]);

  return (
    <Container
      version="v4"
      className="w-full"
      style={{ height: "calc(100vh - 60px)" }}
    >
      <div>
        <div className="w-90 p-10">
          <h2
            className="mid-text text-primary font-500"
          >
            Domain Checker
          </h2>

          {/* Live ICANN/RDAP badge & Check All Action */}
          <div className="mb-18 mt-8 flex items-center justify-between">
            <div
              className="inline-flex items-center gap-6 rounded-20 px-12 py-4"
              style={{
                backgroundColor: "#f0f5ff",
                border: "1px solid #dbeafe",
              }}
            >
              <span style={{ color: "#2563eb", fontSize: "12px", lineHeight: 1 }}>✦</span>
              <span
                className="mini-text font-500"
                style={{ color: "#2563eb", fontSize: "11.5px" }}
              >
                Real-time results powered by live ICANN/RDAP data
              </span>
            </div>

            <button
              type="button"
              onClick={handleCheckAll}
              className="mini-text font-500 text-primary cursor-pointer border-0 bg-transparent hover:underline"
              style={{ background: "transparent", border: "none" }}
              title="Check registration status for all listed extensions"
            >
              Check All Live
            </button>
          </div>

          {/* Search Bar Input using Fields */}
          <div ref={containerRef} className="relative w-full mb-8">
            <Fields
              type="input"
              value={searchQuery}
              onChange={handleSearchChange}
              placeholder="Search domain..."
              icon="Search"
              iconPosition="left"
              outline={false}
              style={{
                border: "1.5px solid #0f172a",
                backgroundColor: "#ffffff",
                height: "48px",
                borderRadius: "8px",
                fontSize: "14.5px",
                fontWeight: "500",
                color: "#0f172a",
                paddingLeft: "42px",
                paddingRight: searchQuery ? "40px" : "14px",
              }}
            />

            {searchQuery && (
              <button
                type="button"
                onClick={handleClear}
                className="absolute right-12 top-50 flex items-center justify-center p-4 border-0 bg-transparent cursor-pointer"
                style={{
                  transform: "translateY(-50%)",
                  background: "transparent",
                  border: "none",
                  cursor: "pointer",
                  zIndex: 10,
                }}
                title="Clear input"
              >
                <Icon name="Close" width="14" height="14" stroke="#64748b" strokeWidth="2.2" />
              </button>
            )}
          </div>

          {/* Keyboard shortcut hints */}
          <div className="flex items-center gap-14 mb-18 text-gray mini-text">
            <div className="flex items-center gap-4">
              <kbd
                className="border rounded-4 font-600 mini-text text-gray"
                style={{
                  fontSize: "10px",
                  borderRadius: "4px",
                  border: "1px solid #e2e8f0",
                  backgroundColor: "#f8fafc",
                  padding: "2px 6px",
                  color: "#64748b",
                }}
              >
                /
              </kbd>
              <span style={{ fontSize: "11.5px", color: "#64748b" }}>to focus</span>
            </div>

            <div className="flex items-center gap-4">
              <kbd
                className="border rounded-4 font-600 mini-text text-gray"
                style={{
                  fontSize: "10px",
                  borderRadius: "4px",
                  border: "1px solid #e2e8f0",
                  backgroundColor: "#f8fafc",
                  padding: "2px 6px",
                  color: "#64748b",
                }}
              >
                ↵
              </kbd>
              <span style={{ fontSize: "11.5px", color: "#64748b" }}>to open the top available</span>
            </div>
          </div>

          {/* Availability Header and Share Button */}
          <div className="flex items-center justify-between mb-12">
            <div className="small-text font-400" style={{ color: "#64748b", fontSize: "13px" }}>
              Availability for{" "}
              <span className="font-700 text-dark" style={{ color: "#0f172a" }}>
                {cleanQuery}
              </span>
              {filterMode !== "all" && (
                <span
                  className="ml-8 px-6 py-2 rounded-4 mini-text font-500"
                  style={{
                    backgroundColor: "#f1f5f9",
                    color: "#475569",
                    fontSize: "11px",
                  }}
                >
                  Filtered: {filterMode}
                </span>
              )}
            </div>

            <button
              type="button"
              onClick={handleShare}
              className="flex items-center gap-6 border-0 bg-transparent cursor-pointer mini-text font-500 transition-colors"
              style={{
                color: "#64748b",
                background: "transparent",
                border: "none",
                cursor: "pointer",
              }}
            >
              <Icon
                name={shareCopied ? "Check" : "ExternalLink"}
                width="12"
                height="12"
                stroke={shareCopied ? "#10b981" : "#64748b"}
              />
              <span style={{ fontSize: "12px", color: shareCopied ? "#10b981" : "#64748b" }}>
                {shareCopied ? "Copied" : "Share"}
              </span>
            </button>
          </div>

          {/* Primary .com Hero Card */}
          <PrimaryDomainCard
            domain={primaryDomain}
            result={domainResults[primaryDomain]}
            isLoading={Boolean(loadingDomains[primaryDomain])}
            isStarred={starredDomains.includes(primaryDomain)}
            isCopied={copiedDomain === primaryDomain}
            onToggleStar={handleToggleStar}
            onCopy={handleCopy}
            onFilter={handleFilter}
            onCheck={handleCheckDomain}
          />

          {/* Extensions 2-Column Grid */}
          <div className="grid grid-cols-2 gap-12 sm-grid-cols-1 mb-20">
            <div>
              {filteredExtLeft.map((domain) => (
                <DomainRow
                  key={domain}
                  domain={domain}
                  result={domainResults[domain]}
                  isLoading={Boolean(loadingDomains[domain])}
                  isStarred={starredDomains.includes(domain)}
                  isCopied={copiedDomain === domain}
                  onToggleStar={handleToggleStar}
                  onCopy={handleCopy}
                  onCheck={handleCheckDomain}
                />
              ))}
            </div>

            <div>
              {filteredExtRight.map((domain) => (
                <DomainRow
                  key={domain}
                  domain={domain}
                  result={domainResults[domain]}
                  isLoading={Boolean(loadingDomains[domain])}
                  isStarred={starredDomains.includes(domain)}
                  isCopied={copiedDomain === domain}
                  onToggleStar={handleToggleStar}
                  onCopy={handleCopy}
                  onCheck={handleCheckDomain}
                />
              ))}
            </div>
          </div>

          {/* "More ideas you might like" Section */}
          <div className="mt-20">
            <div className="flex items-center gap-6 mb-12">
              <span style={{ color: "#f59e0b", fontSize: "14px", lineHeight: 1 }}>⚡</span>
              <h4
                className="small-text font-600 text-dark"
                style={{
                  fontSize: "13.5px",
                  fontWeight: "600",
                  color: "#334155",
                  margin: 0,
                }}
              >
                More ideas you might like
              </h4>
            </div>

            <div className="grid grid-cols-2 gap-12 sm-grid-cols-1">
              <div>
                {filteredIdeasLeft.map((domain) => (
                  <DomainRow
                    key={domain}
                    domain={domain}
                    result={domainResults[domain]}
                    isLoading={Boolean(loadingDomains[domain])}
                    isStarred={starredDomains.includes(domain)}
                    isCopied={copiedDomain === domain}
                    onToggleStar={handleToggleStar}
                    onCopy={handleCopy}
                    onCheck={handleCheckDomain}
                  />
                ))}
              </div>

              <div>
                {filteredIdeasRight.map((domain) => (
                  <DomainRow
                    key={domain}
                    domain={domain}
                    result={domainResults[domain]}
                    isLoading={Boolean(loadingDomains[domain])}
                    isStarred={starredDomains.includes(domain)}
                    isCopied={copiedDomain === domain}
                    onToggleStar={handleToggleStar}
                    onCopy={handleCopy}
                    onCheck={handleCheckDomain}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </Container>
  );
};

export default React.memo(Domain);
