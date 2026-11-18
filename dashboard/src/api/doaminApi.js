import axios from "axios";

const BOOTSTRAP_URL = "https://data.iana.org/rdap/dns.json";

let bootstrapCache = null;
let bootstrapExpiry = 0;

// Fallback bootstrap map for top TLDs if IANA is unreachable or rate-limited
const FALLBACK_SERVICES = [
  [["com", "net"], ["https://rdap.verisign.com/com/v1/"]],
  [["org"], ["https://rdap.publicinterestregistry.org/rdap/"]],
  [["in", "co.in", "net.in", "org.in"], ["https://rdap.registry.in/"]],
  [["io"], ["https://rdap.identitydigital.services/rdap/"]],
  [["ai"], ["https://rdap.whois.ai/"]],
  [["co"], ["https://rdap.identitydigital.services/rdap/"]],
  [["app", "dev"], ["https://rdap.nic.google/"]],
  [["xyz"], ["https://rdap.centralnic.com/xyz/"]],
  [["tech", "online", "store"], ["https://rdap.centralnic.com/"]],
];

/**
 * Retrieve IANA RDAP DNS bootstrap directory with 24-hour in-memory cache
 */
export async function getBootstrap() {
  if (bootstrapCache && Date.now() < bootstrapExpiry) {
    return bootstrapCache;
  }

  try {
    const { data } = await axios.get(BOOTSTRAP_URL, {
      timeout: 10000,
    });

    if (data && Array.isArray(data.services)) {
      bootstrapCache = data;
      bootstrapExpiry = Date.now() + 24 * 60 * 60 * 1000;
      return data;
    }
    return { services: FALLBACK_SERVICES };
  } catch (error) {
    console.warn("IANA RDAP bootstrap unavailable, using fallback registry:", error?.message);
    if (bootstrapCache) return bootstrapCache;
    return { services: FALLBACK_SERVICES };
  }
}

/**
 * Extract root TLD or multi-part TLD from a domain string
 */
const extractTld = (domain) => {
  const parts = domain.toLowerCase().split(".");
  if (parts.length <= 1) return "";
  const lastTwo = parts.slice(-2).join(".");
  if (["co.in", "net.in", "org.in", "co.uk", "org.uk", "com.au"].includes(lastTwo)) {
    return lastTwo;
  }
  return parts[parts.length - 1];
};

/**
 * Check single domain registration status via live RDAP protocol
 * @param {string} domain - Domain name to check (e.g. "nowcheck.com")
 * @returns {Promise<{domain: string, status: string, message: string, data?: object}>}
 */
export async function checkDomainApi(domain) {
  if (!domain || typeof domain !== "string") {
    return {
      domain: domain || "",
      status: "unsupported",
      message: "Please enter a valid domain name.",
    };
  }

  const cleanDomain = domain.trim().toLowerCase();
  const tld = extractTld(cleanDomain);

  if (!tld) {
    return {
      domain: cleanDomain,
      status: "unsupported",
      message: "Domain must include a valid extension.",
    };
  }

  const bootstrap = await getBootstrap();
  const service = bootstrap?.services?.find(([tlds]) =>
    tlds.map((item) => item.toLowerCase()).includes(tld)
  );

  if (!service || !service[1]?.[0]) {
    return {
      domain: cleanDomain,
      status: "unsupported",
      message: "RDAP is not available for this extension.",
    };
  }

  const baseRdapUrl = service[1][0].replace(/\/$/, "");
  const rdapUrl = `${baseRdapUrl}/domain/${encodeURIComponent(cleanDomain)}`;

  try {
    const response = await axios.get(rdapUrl, {
      timeout: 8000,
      validateStatus: () => true,
    });

    const data = response?.data;
    const httpStatus = response?.status;

    // HTTP 200 or objectClassName "domain" means the domain is registered/taken
    if (data?.objectClassName === "domain" || httpStatus === 200) {
      return {
        domain: cleanDomain,
        status: "registered",
        message: "Domain is already registered.",
        details: {
          handle: data?.handle,
          status: data?.status,
          events: data?.events,
          entities: data?.entities,
        },
      };
    }

    // HTTP 404 indicates the domain was not found in the registry (available)
    if (data?.errorCode === 404 || httpStatus === 404) {
      return {
        domain: cleanDomain,
        status: "available",
        message: "Domain is available.",
      };
    }

    // HTTP 400 or generic error
    if (data?.errorCode === 400 || httpStatus === 400) {
      return {
        domain: cleanDomain,
        status: "unknown",
        message: "Registration status could not be confirmed.",
      };
    }

    return {
      domain: cleanDomain,
      status: "unknown",
      message: "Unable to verify domain status.",
    };
  } catch (error) {
    return {
      domain: cleanDomain,
      status: "unknown",
      message: "RDAP service temporarily unavailable.",
    };
  }
}

/**
 * Check multiple domains in parallel with batch limit
 */
export async function checkMultipleDomainsApi(domains = [], batchSize = 4) {
  const results = {};
  for (let i = 0; i < domains.length; i += batchSize) {
    const chunk = domains.slice(i, i + batchSize);
    const chunkResults = await Promise.all(chunk.map((d) => checkDomainApi(d)));
    chunkResults.forEach((res) => {
      results[res.domain] = res;
    });
  }
  return results;
}

export default {
  checkDomain: checkDomainApi,
  checkMultipleDomains: checkMultipleDomainsApi,
  getBootstrap,
};
