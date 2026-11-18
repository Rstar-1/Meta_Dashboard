import React, { useState, useCallback, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Container from "../../components/common/Container";
import Badge from "../../components/common/Badge";
import Icon from "../../components/common/Icon";
import Button from "../../components/common/Button";
import Fields from "../../components/forms/Fields";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import lightBg from "../../assets/light-bg.svg";

/* ==========================================================================
   STATIC MOCK DATA
   ========================================================================== */

const CAMPAIGN_DATA = [
  {
    id: "whatsapp",
    title: "WhatsApp Campaign",
    channel: "whatsapp",
    totalSent: "28,450",
    deliveredValue: 98.8,
    metrics: [
      { label: "Delivered", val: "98.8%" },
      { label: "Read Rate", val: "89.2%" },
      { label: "Response", val: "34.8%" },
    ],
  },
  {
    id: "gmail",
    title: "Gmail Campaign",
    channel: "gmail",
    totalSent: "19,820",
    deliveredValue: 99.4,
    metrics: [
      { label: "Delivered", val: "99.4%" },
      { label: "Open Rate", val: "44.6%" },
      { label: "CTR", val: "18.2%" },
    ],
  },
  {
    id: "sms",
    title: "SMS Campaign",
    channel: "sms",
    totalSent: "12,340",
    deliveredValue: 99.1,
    metrics: [
      { label: "Delivered", val: "99.1%" },
      { label: "Click Rate", val: "22.4%" },
      { label: "Segments", val: "1.2 / msg" },
    ],
  },
];

const TOP_5_STATES = [
  {
    id: "maharashtra",
    name: "Maharashtra",
    hub: "Mumbai",
    subtitle: "Hub: Mumbai • 8 Top Cities",
    displayIndex: 1,
    lat: 19.7515,
    lng: 75.7139,
  },
  {
    id: "gujarat",
    name: "Gujarat",
    hub: "Ahmedabad",
    subtitle: "Hub: Ahmedabad • 8 Top Cities",
    displayIndex: 2,
    lat: 22.2587,
    lng: 71.1924,
  },
  {
    id: "karnataka",
    name: "Karnataka",
    hub: "Bengaluru",
    subtitle: "Hub: Bengaluru • 8 Top Cities",
    displayIndex: 3,
    lat: 15.3173,
    lng: 75.7139,
  },
  {
    id: "andhra-pradesh",
    name: "Andhra Pradesh",
    hub: "Visakhapatnam",
    subtitle: "Hub: Visakhapatnam • 8 Top...",
    displayIndex: 4,
    lat: 15.9129,
    lng: 79.74,
  },
  {
    id: "west-bengal",
    name: "West Bengal",
    hub: "Kolkata",
    subtitle: "Hub: Kolkata • 8 Top Cities",
    displayIndex: 5,
    lat: 22.9868,
    lng: 87.855,
  },
];

/* ==========================================================================
   ANIMATED ORBITAL RADAR (ENLARGED & ROTATING)
   ========================================================================== */

const OrbitalRadar = React.memo(() => (
  <div
    className="relative flex items-center justify-center"
    style={{ width: "100%", maxWidth: 500, height: 500 }}
  >
    <style>{`
      @keyframes orbitCW { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
      @keyframes orbitCCW { from { transform: rotate(0deg); } to { transform: rotate(-360deg); } }
      @keyframes radarSweep { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
      @keyframes radarPulse { 0%, 100% { box-shadow: 0 0 16px rgba(99,102,241,0.3); } 50% { box-shadow: 0 0 32px rgba(99,102,241,0.7); } }
    `}</style>

    <svg
      width="100%"
      height="100%"
      viewBox="0 0 500 500"
      fill="none"
      className="overflow-visible"
    >
      <defs>
        <radialGradient
          id="radarSweepGlow"
          cx="250"
          cy="250"
          r="236"
          gradientUnits="userSpaceOnUse"
        >
          <stop offset="0%" stopColor="#6366f1" stopOpacity="0.35" />
          <stop offset="65%" stopColor="#38bdf8" stopOpacity="0.15" />
          <stop offset="100%" stopColor="#0d111a" stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* Axis Lines */}
      <line x1="250" y1="10" x2="250" y2="490" stroke="#1e293b" strokeDasharray="3 4" strokeWidth="1.2" opacity="0.75" />
      <line x1="10" y1="250" x2="490" y2="250" stroke="#1e293b" strokeDasharray="3 4" strokeWidth="1.2" opacity="0.75" />

      {/* Static Concentric Circles */}
      <circle cx="250" cy="250" r="236" stroke="#334155" strokeDasharray="3 4" strokeWidth="1.4" opacity="0.65" />
      <circle cx="250" cy="250" r="165" stroke="#334155" strokeDasharray="3 4" strokeWidth="1.4" opacity="0.75" />
      <circle cx="250" cy="250" r="105" stroke="#475569" strokeDasharray="3 4" strokeWidth="1.4" opacity="0.85" />

      {/* Tier Labels */}
      <text x="250" y="14" fill="#94a3b8" fontSize="11" fontWeight="700" textAnchor="middle" letterSpacing="1">TIER 3</text>
      <text x="250" y="80" fill="#94a3b8" fontSize="11" fontWeight="700" textAnchor="middle" letterSpacing="1">TIER 2</text>
      <text x="250" y="140" fill="#94a3b8" fontSize="11" fontWeight="700" textAnchor="middle" letterSpacing="1">TIER 1</text>

      {/* Continuous Radar Sweep Beam */}
      <g style={{ transformOrigin: "250px 250px", animation: "radarSweep 12s linear infinite" }}>
        <path d="M 250 250 L 486 250 A 236 236 0 0 0 417 83 Z" fill="url(#radarSweepGlow)" opacity="0.65" />
        <line x1="250" y1="250" x2="486" y2="250" stroke="#818cf8" strokeWidth="2" opacity="0.85" />
      </g>

      {/* Solid Ray from Center to Bottom-Left Ring on Tier 3 */}
      <line x1="250" y1="250" x2="75" y2="412" stroke="#818cf8" strokeWidth="2" opacity="0.85" />

      {/* Rotating Tier 3 Nodes (CW 48s) */}
      <g style={{ transformOrigin: "250px 250px", animation: "orbitCW 48s linear infinite" }}>
        <circle cx="250" cy="14" r="4.5" fill="#ef4444" />
        <circle cx="431" cy="98" r="4" fill="#ef4444" />
        <circle cx="486" cy="250" r="6" fill="none" stroke="#94a3b8" strokeWidth="1.8" />
        <circle cx="454" cy="368" r="4.5" fill="#f59e0b" />
        <circle cx="311" cy="478" r="4.5" fill="#ef4444" />
        <circle cx="75" cy="412" r="6" fill="none" stroke="#94a3b8" strokeWidth="1.8" />
        <circle cx="22" cy="311" r="4.5" fill="#f97316" />
        <circle cx="57" cy="115" r="4.5" fill="#f97316" />
      </g>

      {/* Rotating Tier 2 Nodes (CCW 38s) */}
      <g style={{ transformOrigin: "250px 250px", animation: "orbitCCW 38s linear infinite" }}>
        <circle cx="264" cy="86" r="4" fill="#f97316" />
        <circle cx="367" cy="133" r="6" fill="none" stroke="#94a3b8" strokeWidth="1.8" />
        <circle cx="413" cy="221" r="4.5" fill="#ef4444" />
        <circle cx="405" cy="306" r="4.5" fill="#f97316" />
        <circle cx="356" cy="376" r="4" fill="#f59e0b" />
        <circle cx="168" cy="393" r="4.5" fill="#ef4444" />
        <circle cx="91" cy="293" r="4.5" fill="#f97316" />
        <circle cx="100" cy="180" r="4" fill="#f59e0b" />
      </g>

      {/* Rotating Tier 1 Nodes (CW 28s) */}
      <g style={{ transformOrigin: "250px 250px", animation: "orbitCW 28s linear infinite" }}>
        <circle cx="324" cy="176" r="4.5" fill="#ef4444" />
        <circle cx="351" cy="277" r="4.5" fill="#f97316" />
        <circle cx="176" cy="324" r="4" fill="#ef4444" />
        <circle cx="147" cy="232" r="4.5" fill="#f97316" />
        <circle cx="183" cy="170" r="4" fill="#f59e0b" />
      </g>

      {/* Dashed Leader Lines to Badges */}
      <line x1="70" y1="160" x2="160" y2="160" stroke="#cbd5e1" strokeWidth="1.3" strokeDasharray="3 3" opacity="0.85" />
      <line x1="65" y1="315" x2="155" y2="315" stroke="#cbd5e1" strokeWidth="1.3" strokeDasharray="3 3" opacity="0.85" />
    </svg>

    {/* CloudMind Badge */}
    <div
      className="absolute bg-white rounded-20 px-12 py-6 flex items-center gap-9 d-shadow cursor-pointer select-none"
      style={{ top: "26%", left: "0%", zIndex: 12 }}
    >
      <span className="font-600 text-dark small-text">CloudMind</span>
      <span className="font-700 text-danger small-text">81</span>
    </div>

    {/* Acme AI Badge */}
    <div
      className="absolute bg-white rounded-20 px-12 py-6 flex items-center gap-9 d-shadow cursor-pointer select-none"
      style={{ top: "58%", left: "-2%", zIndex: 12 }}
    >
      <span className="font-600 text-dark small-text">Acme AI</span>
      <span className="font-700 text-warning small-text">64</span>
    </div>

    {/* Center Core: 412 vendors */}
    <div
      className="absolute rounded-full flex flex-column items-center justify-center bg-dark cursor-pointer select-none"
      style={{
        width: 96,
        height: 96,
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        zIndex: 14,
        animation: "radarPulse 3s ease-in-out infinite",
        boxShadow: "0 0 28px rgba(99,102,241,0.5)",
      }}
      title="Total 412 active vendors"
    >
      <span className="font-700 text-white leading-tight" style={{ fontSize: "22px" }}>412</span>
      <span className="text-white mini-text text-muted font-400 mt-2">vendors</span>
    </div>
  </div>
));
OrbitalRadar.displayName = "OrbitalRadar";

/* ==========================================================================
   CAMPAIGN ANALYTICS (WHATSAPP, GMAIL, SMS)
   ========================================================================== */

const CampaignAnalyticsSection = React.memo(({ onNavigateChannel }) => (
  <div className="grid-cols-3 gap-9">
    {CAMPAIGN_DATA.map((camp) => (
      <div
        key={camp.id}
        onClick={() => onNavigateChannel(camp.channel)}
        className="rounded-5 p-13 bg-white cursor-pointer"
      >
        <div>
          <Badge text="active" variant="dot" size="sm" className="font-500 capitalize" />
          <h4 className="mid-text font-600 text-dark capitalize mt-2">{camp.title}</h4>
          <p className="mini-text text-gray mt-2">Total messages delivered this cycle</p>
        </div>

        <div className="bg-forth p-10 rounded-5 mt-8">
          <h5 className="title-text font-600 text-dark">{camp.totalSent}</h5>

          <div className="w-full bg-forth my-6 overflow-hidden" style={{ height: "6px" }}>
            <div
              className="rounded-5 bg-success"
              style={{ width: `${camp.deliveredValue}%`, height: "100%" }}
            />
          </div>

          <div className="grid-cols-3 gap-9 bordh mt-10 pt-8">
            {camp.metrics.map((m) => (
              <div key={m.label}>
                <p className="text-gray font-500 mini-text">{m.label}</p>
                <p className="font-600 text-dark small-text mt-1">{m.val}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    ))}
  </div>
));
CampaignAnalyticsSection.displayName = "CampaignAnalyticsSection";

/* ==========================================================================
   MAP SECTION (LEAFLET MAP - TOP 5 STATES MATCHING LOCATION.JSX)
   ========================================================================== */

const createLocationMarkerIcon = (item, isSelected) =>
  L.divIcon({
    className: "custom-journey-marker-container",
    html: `
      <div style="position: relative; display: flex; flex-direction: column; align-items: center; cursor: pointer; pointer-events: auto;">
        <div style="
          background: #ffffff;
          padding: 4px 10px;
          border-radius: 6px;
          box-shadow: 0 2px 8px rgba(0,0,0,0.15);
          border: 1px solid ${isSelected ? "#2563eb" : "#e2e8f0"};
          text-align: center;
          white-space: nowrap;
          margin-bottom: 5px;
          transition: all 0.2s ease;
          transform: ${isSelected ? "scale(1.05)" : "scale(1)"};
        ">
          <div style="font-weight: 700; font-size: 11px; color: #0f172a; line-height: 13px;">${item.name}</div>
          <div style="font-size: 8.5px; color: #64748b; line-height: 11px;">Hub: ${item.hub}</div>
        </div>
        <div style="
          width: 24px;
          height: 24px;
          border-radius: 50%;
          background: ${isSelected ? "#2563eb" : "#db5e1f"};
          color: #ffffff;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 700;
          font-size: 11px;
          border: 2px solid #ffffff;
          box-shadow: 0 0 0 ${isSelected ? "3px #2563eb" : "2px rgba(0,0,0,0.18)"};
          transition: all 0.2s ease;
        ">
          ${item.displayIndex}
        </div>
      </div>
    `,
    iconSize: [120, 56],
    iconAnchor: [60, 56],
  });

const DashboardLocationCard = React.memo(({ item, isSelected, onSelect }) => (
  <div
    onClick={() => onSelect(item)}
    className={`p-10 cursor-pointer  rounded-5 ${isSelected ? "bg-primary rounded-5" : "bg-forth bordb"
      }`}
  >
    <div className="flex items-center gap-9 overflow-hidden">
      <div className="w-15">
        <div
          className={`rounded-5 flex items-center justify-center ${isSelected ? "bg-white" : "bg-tertiary"
            }`}
          style={{ height: '50px', width: '50px' }}
        >
          <p className={`font-500 para-text ${isSelected ? "text-dark" : "text-dark"}`}>
            {item.displayIndex}
          </p>
        </div>
      </div>

      <div className="w-85">
        <h6 className={`font-500 headmini-text line-clamp1 ${isSelected ? "text-white" : "text-dark"}`}>
          {item.name}
        </h6>
        <p className={`font-400 mini-text line-clamp1 mt-2 ${isSelected ? "text-white opacity-80" : "text-gray"}`}>
          {item.subtitle}
        </p>
      </div>

      <div className="flex items-center pr-4">
        <Icon
          name="ChevronRight"
          width="17"
          height="17"
          stroke={isSelected ? "var(--white)" : "var(--gray)"}
        />
      </div>
    </div>
  </div>
));
DashboardLocationCard.displayName = "DashboardLocationCard";

const MapSection = React.memo(() => {
  const [selectedStateId, setSelectedStateId] = useState("maharashtra");
  const mapContainerRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markersRef = useRef([]);
  const polylinesRef = useRef([]);

  // Initialize Leaflet Map focused directly on Maharashtra on first view
  useEffect(() => {
    if (!mapContainerRef.current || mapInstanceRef.current) return;

    const initialTarget = TOP_5_STATES[0]; // Maharashtra
    const map = L.map(mapContainerRef.current, {
      center: [initialTarget.lat, initialTarget.lng],
      zoom: 6,
      minZoom: 4,
      maxZoom: 10,
      zoomControl: false,
      attributionControl: false,
      scrollWheelZoom: false,
    });

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      maxZoom: 19,
    }).addTo(map);

    mapInstanceRef.current = map;

    const timer = setTimeout(() => {
      map.invalidateSize();
    }, 200);

    return () => {
      clearTimeout(timer);
      map.remove();
      mapInstanceRef.current = null;
    };
  }, []);

  // Sync Markers and Route Lines when selectedStateId changes
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    // Clear previous markers & polylines
    markersRef.current.forEach((m) => map.removeLayer(m));
    markersRef.current = [];
    polylinesRef.current.forEach((p) => map.removeLayer(p));
    polylinesRef.current = [];

    // Render journey route lines
    if (TOP_5_STATES.length >= 2) {
      const latLngs = TOP_5_STATES.map((s) => [s.lat, s.lng]);

      const outerLine = L.polyline(latLngs, {
        color: "#bfdbfe",
        weight: 5,
        opacity: 0.65,
        lineCap: "round",
        lineJoin: "round",
      }).addTo(map);

      const coreLine = L.polyline(latLngs, {
        color: "#2563eb",
        weight: 2,
        dashArray: "5, 7",
        opacity: 0.95,
      }).addTo(map);

      polylinesRef.current = [outerLine, coreLine];
    }

    // Render custom markers with selected state on top
    TOP_5_STATES.forEach((item) => {
      const isSelected = item.id === selectedStateId;
      const customIcon = createLocationMarkerIcon(item, isSelected);
      const marker = L.marker([item.lat, item.lng], {
        icon: customIcon,
        zIndexOffset: isSelected ? 1000 : 0,
      }).addTo(map);

      marker.on("click", (e) => {
        L.DomEvent.stopPropagation(e);
        setSelectedStateId(item.id);
        map.flyTo([item.lat, item.lng], 6, { duration: 0.8 });
      });

      markersRef.current.push(marker);
    });
  }, [selectedStateId]);

  const handleSelectState = useCallback((state) => {
    setSelectedStateId(state.id);
    const map = mapInstanceRef.current;
    if (map) {
      map.flyTo([state.lat, state.lng], 6, { duration: 0.8 });
    }
  }, []);

  return (
    <div
      className="relative bg-white p-10 rounded-5 gap-9 overflow-hidden"
    >
      <div className="pb-10 pt-5 rounded-5">
        <h4 className="font-500 text-dark mid-text capitalize">
          Geologically Your Business
        </h4>
      </div>
      <div className="grid-cols-2 gap-9 bordh pt-10">
        <div className="overflow-hidden h-350 z-10 border-white rounded-5">
          <div ref={mapContainerRef} style={{ width: "100%", height: "100%" }} />
        </div>

        <div className="grid-cols-1">
          {TOP_5_STATES.map((state) => (
            <DashboardLocationCard
              key={state.id}
              item={state}
              isSelected={selectedStateId === state.id}
              onSelect={handleSelectState}
            />
          ))}
        </div>
      </div>
    </div>
  );
});
MapSection.displayName = "MapSection";

/* ==========================================================================
   AI CHAT ASSISTANT CARD (LOOPAI, GPT CHAT, DEEP SEEK)
   ========================================================================== */

const AI_MODELS = [
  { id: "loopai", name: "LoopAI", icon: "Link" },
  { id: "gpt", name: "GPT Chat", icon: "AI" },
  { id: "deepseek", name: "Deep Seek", icon: "Sparkles" },
];

const AI_ACTIONS = [
  {
    id: "text",
    title: "Text Assistance",
    prompt: "Help me write a professional follow-up email...",
    iconName: "Clipboard",
    iconBg: "#10b981",
  },
  {
    id: "process",
    title: "Process Automation",
    prompt: "Automate delivery status tracking for new orders...",
    iconName: "Bot",
    iconBg: "#fb7185",
  },
  {
    id: "schedule",
    title: "Schedule Optimization",
    prompt: "Optimize supplier pickup schedules for this week...",
    iconName: "Clock",
    iconBg: "#f59e0b",
  },
  {
    id: "smart",
    title: "Smart Response",
    prompt: "Generate an automated smart reply for vendor inquiries...",
    iconName: "Support",
    iconBg: "#ec4899",
  },
];

const AiChatAssistantCard = React.memo(() => {
  const [activeModel, setActiveModel] = useState("loopai");
  const [prompt, setPrompt] = useState("");

  const handleSelectAction = useCallback((action) => {
    setPrompt(action.prompt);
  }, []);

  const handleSubmit = useCallback((e) => {
    e?.preventDefault?.();
    if (!prompt.trim()) return;
    setPrompt("");
  }, [prompt]);

  return (
    <div
      className="p-16 rounded-10 transition-all"
      style={{
        background: "linear-gradient(180deg, #eff4ff 0%, #edf2fe 50%, #f1f5fe 100%)",
        border: "1px solid #dbeafe",
        boxShadow: "0 2px 10px rgba(99, 102, 241, 0.05)",
      }}
    >
      {/* Header Greeting */}
      <div className="text-center mb-12">
        <p className="small-text font-500 text-gray flex items-center justify-center gap-4">
          Hi, Adam <span>👋</span>
        </p>
        <h3
          className="font-700 text-dark mt-4"
          style={{ fontSize: "20px", letterSpacing: "-0.4px" }}
        >
          How can I help you?
        </h3>
      </div>

      {/* Model Selector Tabs with Icon */}
      <div className="flex items-center justify-between gap-9 mb-12">
        {AI_MODELS.map((model) => {
          const isActive = activeModel === model.id;
          return (
            <button
              key={model.id}
              type="button"
              onClick={() => setActiveModel(model.id)}
              className="flex items-center gap-9 cursor-pointer border-0 transition-all select-none"
              style={{
                padding: "6px 12px",
                borderRadius: "20px",
                background: isActive ? "#ffffff" : "transparent",
                color: isActive ? "#1e293b" : "#64748b",
                fontWeight: isActive ? 600 : 500,
                fontSize: "12px",
                boxShadow: isActive ? "0 2px 6px rgba(0,0,0,0.06)" : "none",
              }}
            >
              <Icon
                name={model.icon}
                width="13"
                height="13"
                stroke={isActive ? "#4f46e5" : "currentColor"}
              />
              <span>{model.name}</span>
            </button>
          );
        })}
      </div>

      {/* 2x2 Feature Action Cards with Icon */}
      <div className="grid-cols-2 gap-9 mb-12">
        {AI_ACTIONS.map((action) => (
          <div
            key={action.id}
            onClick={() => handleSelectAction(action)}
            className="bg-white rounded-10 p-12 cursor-pointer transition-all hover:d-shadow select-none"
            style={{
              minHeight: "76px",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              border: "1px solid rgba(226, 232, 240, 0.8)",
            }}
          >
            <div
              className="flex items-center justify-center text-white"
              style={{
                width: 22,
                height: 22,
                borderRadius: 6,
                background: action.iconBg,
              }}
            >
              <Icon name={action.iconName} width="13" height="13" stroke="#ffffff" />
            </div>
            <p
              className="font-600 text-dark leading-tight mt-8"
              style={{ fontSize: "12px" }}
            >
              {action.title}
            </p>
          </div>
        ))}
      </div>

      {/* Ask Something Input Bar with Fields */}
      <form onSubmit={handleSubmit} className="w-full">
        <Fields
          type="text"
          value={prompt}
          onChange={(val) => setPrompt(val)}
          placeholder="Ask something..."
          icon="Sparkles"
          iconPosition="right"
          border={false}
          outline={false}
          className="w-full text-dark mini-text"
          style={{
            height: "40px",
            borderRadius: "24px",
            border: "1px solid #e2e8f0",
            backgroundColor: "#ffffff",
            paddingLeft: "16px",
            paddingRight: "40px",
            boxShadow: "0 1px 4px rgba(0,0,0,0.03)",
          }}
        />
      </form>
    </div>
  );
});
AiChatAssistantCard.displayName = "AiChatAssistantCard";

/* ==========================================================================
   AI MODEL CARDS (ORNITH 1.5, NEMOTRON, QWEN 2.5 CODER)
   ========================================================================== */

const AI_MODEL_CARDS = [
  {
    id: "ornith",
    title: "Ornith 1.5",
    provider: "DeepReinforce",
    description:
      "A smart, well-rounded assistant that can reason through problems, understand pictures and help with everyday work.",
    capabilities: [
      { id: "tools", label: "Tools", icon: "tools" },
      { id: "reasoning", label: "Reasoning", icon: "reasoning" },
      { id: "image", label: "Image input", icon: "image" },
    ],
    credits: "45",
    avatar: (
      <div
        className="flex items-center justify-center flex-shrink-0"
        style={{
          width: 38,
          height: 38,
          borderRadius: 8,
          background: "#242938",
          border: "1px solid rgba(255, 255, 255, 0.08)",
        }}
      >
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
          <circle cx="12" cy="12" r="9" fill="#fde68a" />
          <circle cx="9" cy="11" r="3" stroke="#1f2937" strokeWidth="1.5" fill="#ffffff" />
          <circle cx="15" cy="11" r="3" stroke="#1f2937" strokeWidth="1.5" fill="#ffffff" />
          <circle cx="9" cy="11" r="1.2" fill="#1f2937" />
          <circle cx="15" cy="11" r="1.2" fill="#1f2937" />
          <line x1="12" y1="11" x2="12" y2="11" stroke="#1f2937" strokeWidth="1.5" />
          <path d="M10 16c1 .5 3 .5 4 0" stroke="#1f2937" strokeWidth="1.2" strokeLinecap="round" />
        </svg>
      </div>
    ),
  },
  {
    id: "nemotron",
    title: "Nemotron 3.5 Lightning",
    provider: "Nvidia",
    description:
      "NVIDIA's fast assistant built to work through long tasks and very long documents without losing track.",
    capabilities: [
      { id: "tools", label: "Tools", icon: "tools" },
      { id: "reasoning", label: "Reasoning", icon: "reasoning" },
    ],
    credits: "69",
    avatar: (
      <div
        className="flex items-center justify-center flex-shrink-0"
        style={{
          width: 38,
          height: 38,
          borderRadius: 8,
          background: "rgba(118, 185, 0, 0.12)",
          border: "1px solid rgba(118, 185, 0, 0.25)",
        }}
      >
        <svg width="22" height="22" viewBox="0 0 24 24" fill="#76b900">
          <path d="M8.9 7.2c-.4.3-.7.7-1 1.2-1.7 2.6-.9 6.2 1.8 7.8 2.6 1.6 6.1.7 7.7-2 1.5-2.6.7-6-1.8-7.6-1.4-.9-3-1.2-4.5-.9 1.3-.4 2.8-.3 4 .5 2.1 1.3 2.7 4.1 1.4 6.2s-4.1 2.7-6.2 1.4c-2.1-1.3-2.7-4.1-1.4-6.2.2-.4.6-.7.9-.9V5.1c-.8.3-1.6.8-2.3 1.5-2.7 2.8-2.7 7.3 0 10.1 2.8 2.8 7.3 2.7 10.1 0 2.7-2.8 2.7-7.2 0-10-1.4-1.4-3.2-2.1-5.1-2.1-1.4 0-2.7.4-3.9 1.2v1.4z" />
        </svg>
      </div>
    ),
  },
  {
    id: "qwen",
    title: "Qwen 2.5 Coder",
    provider: "Alibaba",
    description:
      "A programming helper that writes, explains and through problems fixes code in many programming languages.",
    capabilities: [
      { id: "tools", label: "Tools", icon: "tools" },
    ],
    credits: "45",
    avatar: (
      <div
        className="flex items-center justify-center flex-shrink-0"
        style={{
          width: 38,
          height: 38,
          borderRadius: 8,
          background: "rgba(59, 130, 246, 0.12)",
          border: "1px solid rgba(59, 130, 246, 0.25)",
        }}
      >
        <svg width="22" height="22" viewBox="0 0 24 24" fill="#3b82f6">
          <path d="M12 2L4 7v10l8 5 8-5V7l-8-5zm0 2.4l5.6 3.5L12 11.4 6.4 7.9 12 4.4zM6 9.4l5 3.1v6.2l-5-3.1V9.4zm7 9.3v-6.2l5-3.1v6.2l-5 3.1z" />
        </svg>
      </div>
    ),
  },
];

const AiModelCardsSection = React.memo(() => {

  return (
    <div
      className="relative bg-white p-10 rounded-5 gap-9 overflow-hidden"
    >
      <div className="pb-10 pt-5 rounded-5">
        <h4 className="font-500 text-dark mid-text capitalize">
          Geologically Your Business
        </h4>
      </div>
      <div className="grid-cols-3 gap-9 bordh pt-8">
        {AI_MODEL_CARDS.map((model) => {
          return (
            <div
              key={model.id}
              className="rounded-5 bg-forth p-14"
              style={{
                minHeight: "160px",
              }}
            >
              <div>
                <div className="flex items-center gap-9">
                  {model.avatar}
                  <div className="">
                    <h5 className="font-500 text-primary headmini-text capitalize line-clamp1">
                      {model.title}
                    </h5>
                    <p className="mini-text text-gray font-400">
                      {model.provider}
                    </p>
                  </div>
                </div>

                <p
                  className="mt-15 text-gray font-400 mini-text"
                >
                  {model.description}
                </p>

                {/* <div className="mt-8">
                <p className="text-dark font-500 mini-text">
                  Capabilities
                </p>
                <div className="flex items-center gap-9 flex-wrap">
                  {model.capabilities.map(renderCapabilityBadge)}
                </div>
              </div> */}

                <div className="grid-cols-3 gap-9 bordh mt-10 pt-8">
                  <div>
                    <p className="text-gray font-500 mini-text">Delivered</p>
                    <p className="font-600 text-dark small-text mt-1">98%</p>
                  </div>
                  <div>
                    <p className="text-gray font-500 mini-text">Open Rate</p>
                    <p className="font-600 text-dark small-text mt-1">98%</p>
                  </div>
                  <div>
                    <p className="text-gray font-500 mini-text">Delivered</p>
                    <p className="font-600 text-dark small-text mt-1">98%</p>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
});
AiModelCardsSection.displayName = "AiModelCardsSection";

/* ==========================================================================
   YOUR BUSINESS SECTION (WEBSITE DOMAINS & MANAGEMENT)
   ========================================================================== */

const BUSINESS_SITES = [
  {
    id: "ashmitavinyls",
    domain: "ashmitavinyls.com",
    category: "Website",
  }
];

const YourBusinessSection = React.memo(() => (
  <div
    className="rounded-5 p-10 bg-white"
  >
    <div className="pb-10 pt-5 rounded-5">
      <h4 className="font-500 text-dark headmini-text capitalize">
        Your business
      </h4>
    </div>

    <div className="grid-cols-1">
      {BUSINESS_SITES.map((site) => (
        <div
          key={site.id}
          className="py-12 px-8 bordh"
        >
          <div className="flex items-center gap-9">
            <div
              className="icon-lg bg-primary rounded-5"
            >
              <Icon name="Globe" width="20" height="20" stroke="var(--white)" />
            </div>
            <div>
              <h4 className="font-500 headmini-text text-secondary flex items-center gap-9">
                {site.domain}
                <Icon name="ExternalLink" width="13" height="13" stroke="var(--gray)" />
              </h4>
              <p className="text-gray mini-text font-400">
                {site.category}
              </p>
            </div>
          </div>
        </div>
      ))}
    </div>
  </div>
));
YourBusinessSection.displayName = "YourBusinessSection";


/* ==========================================================================
   Social SECTION (WEBSITE DOMAINS & MANAGEMENT)
   ========================================================================== */

const SOCIAL_SITES = [
  {
    id: "ashmitavinyls",
    icon: "Instagram",
    domain: "ashmitavinyls.com",
    bg: "insta",
    category: "Instagram",
  },
  {
    id: "supportsurgical",
    icon: "Facebook",
    domain: "supportsurgical.com",
    bg: "info",
    category: "Facebook",
  },
  {
    id: "ashmitavinyls",
    icon: "YouTube",
    domain: "ashmitavinyls.com",
    bg: "danger",
    category: "Youtube",
  },
  {
    id: "supportsurgical",
    icon: "Twitter",
    domain: "supportsurgical.com",
    bg: "primary",
    category: "Twitter",
  },
  {
    id: "supportsurgical",
    icon: "WhatsApp",
    domain: "supportsurgical.com",
    bg: "success",
    category: "WhatsApp",
  },
];

const SocialSection = React.memo(() => (
  <div
    className="rounded-5 p-10 bg-white"
  >
    <div className="pb-10 pt-5 rounded-5">
      <h4 className="font-500 text-dark headmini-text capitalize">
        Social Handles
      </h4>
    </div>

    <div className="grid-cols-1">
      {SOCIAL_SITES.map((site) => (
        <div
          key={site.id}
          className="py-12 px-8 bordh"
        >
          <div className="flex items-center gap-9">
            <div
              className={`icon-lg bg-${site.bg} rounded-5`}
            >
              <Button
                version="icon"
                bg={site?.bg}
                icon={site?.icon}
                iconWidth="20"
                iconHeight="20"
                iconFill="var(--white)"
                className="rounded-5 flex"
              />
            </div>
            <div>
              <h4 className="font-500 headmini-text text-secondary">
                {site.domain}
              </h4>
              <p className="text-gray mini-text font-400">
                {site.category}
              </p>
            </div>
          </div>
        </div>
      ))}
    </div>
  </div>
));
SocialSection.displayName = "SocialSection";

/* ==========================================================================
   UPDATES SECTION (RECENT UPDATES)
   ========================================================================== */

const RECENT_UPDATES = [
  {
    id: "gpt-image-2-6",
    icon: "Image",
    time: "13 days ago",
    title: "GPT Image 2.6",
    description: "GPT-Image-2.6 Sunburst and GPT-Image-2.6 Flare for image generation and more...",
  },
  {
    id: "decisions-api",
    icon: "Box",
    time: "last month",
    title: "Decisions API",
    description: "Turn text and images into decisions your application can use, 10x faster than the...",
  },
  {
    id: "gpt-6-1-sol",
    icon: "Box",
    time: "last month",
    title: "GPT-6.1 Sol",
    description: "GPT-6.1 Sol brings near-Astra intelligence to Sol pricing for cost-efficient API workloads.",
  },
  {
    id: "gpt-6-astra-sol-luna",
    icon: "Box",
    time: "last month",
    title: "GPT-6 Astra, Sol, and Luna",
    description: "Following the release of GPT Astra, meet GPT-6 Sol for complex coding and agentic workflows,...",
  },
  {
    id: "agents-api",
    icon: "Bot",
    time: "2 months ago",
    title: "Agents API",
    description: "Build durable cloud agents with a managed Codex harness with the Agents API.",
  },
];

const RecentUpdatesSection = React.memo(() => (
  <div className="py-5 px-4">
    <h4 className="font-500 text-dark headmini-text capitalize">
      Updates
    </h4>

    <div className="grid-cols-1 mt-12">
      {RECENT_UPDATES.map((item) => (
        <div
          key={item.id}
          className="flex items-start gap-12 py-14 bordh"
        >
          <div
            className="icon-lg bg-tertiary rounded-5"
          >
            <Icon name={item.icon} width="20" height="20" style={{ color: 'var(--secondary)' }} />
          </div>

          <div className="w-80">
            <p
              className="text-gray font-400 mini-text"
            >
              {item.time}
            </p>
            <h5
              className="font-600 text-dark headmini-text mt-2"
            >
              {item.title}
            </h5>
            <p
              className="text-gray mini-text font-400 mt-2"
            >
              {item.description}
            </p>
          </div>
        </div>
      ))}
    </div>
  </div>
));
RecentUpdatesSection.displayName = "RecentUpdatesSection";

/* ==========================================================================
   MAIN DASHBOARD COMPONENT
   ========================================================================== */

const Dashboard = () => {

  return (
    <Container
      version="v0"
      className="w-full overflow-auto bg-forth"
      style={{
        height: "calc(100vh - 60px)"
      }}
    >
      <div className="flex items-start gap-9 p-10">
        <div className="w-70 grid-cols-1 gap-9">
          <div
            className="rounded-5 bg-secondary relative overflow-hidden"
            style={{
              height: "400px",
              background: "radial-gradient(circle at 85% 30%, rgba(99, 102, 241, 0.15) 0%, transparent 60%), #090e18",
            }}
          >
            <div className="flex items-center justify-between px-30">
              <div className="w-45">
                <h2 className="head-text font-500 text-white uppercase">
                  Hello , <br /> Good morning
                </h2>

                <p className="text-white text-muted font-300 para-text mt-10">
                  CloudMind has had no valid SOC 2 since 30 Sep addendum.
                </p>

                <Button version='v1' text='Explore Now' icon='ChevronRight' iconPosition='right' variant='outline' bg='white' color='white' className='mt-28' />
              </div>
              <div className="w-55 relative" style={{ top: 12, left: 40 }}>
                <OrbitalRadar />
              </div>
            </div>
          </div>
          <AiModelCardsSection />
          <MapSection />
        </div>

        <div className="w-30 grid-cols-1 gap-9">
          <YourBusinessSection />
          <SocialSection />
          {/* <AiChatAssistantCard /> */}
          <RecentUpdatesSection />
        </div>
      </div>
    </Container>
  );
};

export default React.memo(Dashboard);
