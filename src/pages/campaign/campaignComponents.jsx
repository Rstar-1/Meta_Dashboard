import React from "react";
import { canAccessPage, useCurrentUser } from "../../utils";

export const CHANNELS = [
    { id: "whatsapp", name: "Whatsapp" },
    { id: "gmail", name: "Gmail" },
    { id: "sms", name: "SMS" },
];

// Folder icon with customized inner channel badge
export const ChannelFolderIcon = React.memo(({ type = "whatsapp", size = 48 }) => {
    const height = Math.round((size * 64) / 80);

    return (
        <div style={{ position: "relative", width: `${size}px`, height: `${height}px` }}>
            <svg
                width={size}
                height={height}
                viewBox="0 0 80 64"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
            >
                {/* Back flap */}
                <path
                    d="M6 14C6 9.58172 9.58172 6 14 6H29.5C32.3 6 34.9 7.4 36.3 9.8L38.2 13H68C72.4183 13 76 16.5817 76 21V52C76 56.4183 72.4183 60 68 60H14C9.58172 60 6 56.4183 6 52V14Z"
                    fill="#ffedd5"
                />
                {/* Front flap */}
                <path
                    d="M4 22C4 17.5817 7.58172 14 12 14H68C72.4183 14 76 17.5817 76 22V52C76 56.4183 72.4183 60 68 60H12C7.58172 60 4 56.4183 4 52V22Z"
                    fill="#fed7aa"
                />
            </svg>

            {/* Inner glyph overlay */}
            <div
                style={{
                    position: "absolute",
                    top: "44%",
                    left: "50%",
                    transform: "translate(-50%, -50%)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    pointerEvents: "none",
                }}
            >
                {type === "whatsapp" && (
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#ea580c" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
                    </svg>
                )}
                {type === "gmail" && (
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#ea580c" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                        <polyline points="22,6 12,13 2,6" />
                    </svg>
                )}
                {type === "sms" && (
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#ea580c" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                        <line x1="8" y1="10" x2="8.01" y2="10" />
                        <line x1="12" y1="10" x2="12.01" y2="10" />
                        <line x1="16" y1="10" x2="16.01" y2="10" />
                    </svg>
                )}
            </div>
        </div>
    );
});
ChannelFolderIcon.displayName = "ChannelFolderIcon";

// Mini Folder Icon for Template Cards
export const TemplateFolderIcon = React.memo(({ size = 28 }) => {
    const height = Math.round((size * 64) / 80);

    return (
        <svg
            width={size}
            height={height}
            viewBox="0 0 80 64"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
        >
            <path
                d="M6 14C6 9.58172 9.58172 6 14 6H29.5C32.3 6 34.9 7.4 36.3 9.8L38.2 13H68C72.4183 13 76 16.5817 76 21V52C76 56.4183 72.4183 60 68 60H14C9.58172 60 6 56.4183 6 52V14Z"
                fill="#ffedd5"
            />
            <path
                d="M4 22C4 17.5817 7.58172 14 12 14H68C72.4183 14 76 17.5817 76 22V52C76 56.4183 72.4183 60 68 60H12C7.58172 60 4 56.4183 4 52V22Z"
                fill="#fed7aa"
            />
        </svg>
    );
});
TemplateFolderIcon.displayName = "TemplateFolderIcon";

// Channel Selector Card Group
export const ChannelSelector = React.memo(({ activeChannel, onSelectChannel }) => {
    const { user: currentUser, role: userRole } = useCurrentUser();
    const visibleChannels = React.useMemo(() => {
        return CHANNELS.filter((ch) => {
            const pageName = ch.id === "sms" ? "SMS Campaign" : ch.id === "gmail" ? "Gmail Campaign" : "Whatsapp Campaign";
            return canAccessPage(currentUser || userRole, pageName, "Campaign");
        });
    }, [currentUser, userRole]);

    return (
        <div className="mb-20">
            <label className="small-text font-500 text-gray mb-8 block">Send through</label>
            <div className="flex items-center gap-14">
                {visibleChannels.map((ch) => {
                    const isSelected = activeChannel === ch.id;
                    return (
                        <div
                            key={ch.id}
                            onClick={() => onSelectChannel(ch.id)}
                            className="flex flex-column items-center justify-center p-14 rounded-12 cursor-pointer bg-white"
                            style={{
                                flex: 1,
                                minHeight: "92px",
                                border: isSelected ? "1.5px solid #2563eb" : "1px solid #e2e8f0",
                                boxShadow: isSelected ? "0 2px 8px rgba(37,99,235,0.08)" : "none",
                                transition: "all 0.15s ease",
                            }}
                        >
                            <ChannelFolderIcon type={ch.id} size={46} />
                            <span
                                className="small-text font-600 mt-6"
                                style={{ color: isSelected ? "#0f172a" : "#475569" }}
                            >
                                {ch.name}
                            </span>
                        </div>
                    );
                })}
            </div>
        </div>
    );
});
ChannelSelector.displayName = "ChannelSelector";

// Sending To Users preview chip list
export const SendingToChips = React.memo(({ selectedUsers }) => {
    const displayed = selectedUsers.slice(0, 4);
    const remaining = selectedUsers.length - displayed.length;

    return (
        <div className="">
            <label className="mini-text font-500 text-gray">Sending to</label>
            <div className="flex flex-wrap items-center gap-8 mt-3">
                {displayed.map((u) => (
                    <div
                        key={u.id}
                        className="flex items-center gap-6 py-3 pl-4 pr-10 rounded-20 bg-tertiary"
                    >
                        <div
                            className="rounded-20 icon flex items-center justify-center bg-white"
                        >
                            <p className="mini-text font-500 text-primary">{u.avatar}</p>
                        </div>
                        <p className="mini-text font-500 text-gray">
                            {u.name.split(" ")[0]}
                        </p>
                    </div>
                ))}
                {remaining > 0 && (
                    <p className="mini-text text-gray">
                        +{remaining} more
                    </p>
                )}
            </div>
        </div>
    );
});
SendingToChips.displayName = "SendingToChips";

// WhatsApp Special Offer Banner (Image 1)
export const WhatsappSpecialOfferBanner = React.memo(() => (
    <div
        className="w-full rounded-10 overflow-hidden mb-10 relative"
    >
        <div className="flex items-center bg-forth p-10 justify-between">
            <div
                className="flex flex-column items-start justify-center"
                style={{
                    backgroundColor: "#135436",
                    borderRadius: "8px",
                    padding: "10px 14px",
                    boxShadow: "0 2px 4px rgba(0,0,0,0.15)",
                    transform: "rotate(-2deg)",
                }}
            >
                <span
                    style={{
                        color: "#ffffff",
                        fontWeight: "800",
                        fontSize: "17px",
                        lineHeight: "1.1",
                        letterSpacing: "0.5px",
                        fontFamily: "system-ui, -apple-system, sans-serif",
                    }}
                >
                    SPECIAL
                </span>
                <span
                    style={{
                        color: "#ffffff",
                        fontWeight: "800",
                        fontSize: "17px",
                        lineHeight: "1.1",
                        letterSpacing: "0.5px",
                        fontFamily: "system-ui, -apple-system, sans-serif",
                        marginBottom: "6px",
                    }}
                >
                    OFFER
                </span>
                <div
                    style={{
                        backgroundColor: "#facc15",
                        borderRadius: "4px",
                        padding: "2px 6px",
                    }}
                >
                    <span
                        style={{
                            color: "#135436",
                            fontWeight: "800",
                            fontSize: "8px",
                            letterSpacing: "0.4px",
                            whiteSpace: "nowrap",
                        }}
                    >
                        LIMITED TIME ONLY
                    </span>
                </div>
            </div>

            <div className="flex items-end gap-10" style={{ height: "100%", paddingBottom: "2px" }}>
                {/* Shopping Bags */}
                <div className="relative flex items-end">
                    {/* Blue Striped Bag */}
                    <svg width="44" height="58" viewBox="0 0 54 70" fill="none">
                        <path
                            d="M17 22C17 12 37 12 37 22"
                            stroke="#38bdf8"
                            strokeWidth="4"
                            strokeLinecap="round"
                        />
                        <rect x="6" y="20" width="42" height="48" rx="4" fill="#38bdf8" />
                        <rect x="6" y="32" width="42" height="6" fill="#0284c7" />
                        <rect x="6" y="44" width="42" height="6" fill="#0284c7" />
                    </svg>

                    {/* Small Orange Bag */}
                    <svg
                        width="32"
                        height="44"
                        viewBox="0 0 40 54"
                        fill="none"
                        style={{ marginLeft: "-14px", marginBottom: "0px" }}
                    >
                        <path
                            d="M12 18C12 10 28 10 28 18"
                            stroke="#fb923c"
                            strokeWidth="3.5"
                            strokeLinecap="round"
                        />
                        <rect x="4" y="16" width="32" height="36" rx="4" fill="#fb923c" />
                        <path
                            d="M14 26C14 30 26 30 26 26"
                            stroke="#ea580c"
                            strokeWidth="2.5"
                            strokeLinecap="round"
                        />
                    </svg>
                </div>

                {/* 3D Yellow Gift Box with Red Ribbon */}
                <svg width="52" height="60" viewBox="0 0 60 70" fill="none">
                    <path d="M23 16C16 10 14 18 26 19C14 20 16 28 23 22" fill="#dc2626" />
                    <path d="M37 16C44 10 46 18 34 19C46 20 44 28 37 22" fill="#dc2626" />
                    <circle cx="30" cy="19" r="4" fill="#b91c1c" />
                    <rect x="4" y="20" width="52" height="12" rx="3" fill="#facc15" />
                    <rect x="25" y="20" width="10" height="12" fill="#dc2626" />
                    <rect x="8" y="32" width="44" height="34" rx="2" fill="#eab308" />
                    <rect x="25" y="32" width="10" height="34" fill="#dc2626" />
                </svg>
            </div>
        </div>
    </div>
));
WhatsappSpecialOfferBanner.displayName = "WhatsappSpecialOfferBanner";

// Full WhatsApp Template Mockup (matching the 3 screenshots)
export const WhatsappTemplateMockup = React.memo(({ templateType = "welcome", formData = {}, sampleUserName = "Aarav" }) => {
    const isPromotion = templateType === "promotion";
    const isOtp = templateType === "otp";
    const isWelcome = !isPromotion && !isOtp;

    const time = isPromotion ? "11:10 AM" : isOtp ? "11:11 AM" : "10:17 AM";

    return (
        <div>
            <div
                className="rounded-16 overflow-hidden d-shadow"
                style={{
                    backgroundColor: "#efeae2",
                    border: "1px solid #cbd5e1",
                    backgroundImage: "radial-gradient(#d5cebe 0.75px, transparent 0.75px)",
                    backgroundSize: "12px 12px",
                }}
            >
                {/* WhatsApp Top Green Bar */}
                <div
                    className="p-12 px-14 flex items-center gap-10"
                    style={{ backgroundColor: "#005c4b" }}
                >
                    <div
                        className="rounded-full flex items-center justify-center font-700 text-white flex-shrink-0"
                        style={{ width: 34, height: 34, backgroundColor: "#128c7e", fontSize: "16px" }}
                    >
                        C
                    </div>
                    <div>
                        <p className="small-text font-700 text-white leading-tight">
                            Company
                        </p>
                        <p
                            className="mini-text text-white"
                            style={{ opacity: 0.85, fontSize: "11px" }}
                        >
                            Business account
                        </p>
                    </div>
                </div>

                {/* Chat Body */}
                <div className="p-12 pb-14">
                    {/* Message Bubble */}
                    <div
                        className="rounded-12 p-12 relative"
                        style={{
                            backgroundColor: "#dcf8c6",
                            maxWidth: "94%",
                        }}
                    >
                        {/* 1. PROMOTION TEMPLATE (Image 1) */}
                        {isPromotion && (
                            <div>
                                <WhatsappSpecialOfferBanner />
                                <div className="mini-text text-dark" style={{ lineHeight: "1.45", fontSize: "12.5px" }}>
                                    <p className="mb-6">Hi {sampleUserName},</p>
                                    <p className="mb-6">
                                        Enjoy <strong>20% OFF</strong> on select items at Company.
                                    </p>
                                    <p className="mb-6">This limited-time offer is valid until 30 Nov 2026.</p>
                                    <p>Reply SHOP to see what's included!</p>
                                </div>
                            </div>
                        )}

                        {/* 2. OTP TEMPLATE (Image 2) */}
                        {isOtp && (
                            <div className="py-2">
                                <p className="small-text text-dark" style={{ lineHeight: "1.45", fontSize: "13px" }}>
                                    <strong>{formData.otpCode || "546372"}</strong> is your verification code. For your security, do not share this code.
                                </p>
                            </div>
                        )}

                        {/* 3. WELCOME TEMPLATE (Image 3) */}
                        {isWelcome && (
                            <div>
                                <div className="small-text font-700 text-dark mb-4 flex items-center gap-6">
                                    <span>Welcome to</span>
                                    <span
                                        style={{
                                            backgroundColor: "#e0e7ff",
                                            color: "#2563eb",
                                            borderRadius: "4px",
                                            padding: "1px 6px",
                                            fontSize: "12px",
                                            fontWeight: "700",
                                        }}
                                    >
                                        [Company]
                                    </span>
                                </div>
                                <p className="mini-text text-dark" style={{ lineHeight: "1.45", fontSize: "12.5px" }}>
                                    {formData.body || `Hi ${sampleUserName}, thanks for joining us! Enjoy 10% off your first order with code WELCOME10.`}
                                </p>
                                <p className="mini-text text-gray mt-6" style={{ fontSize: "11px", color: "#64748b" }}>
                                    {formData.footer || "Reply STOP to opt out"}
                                </p>
                            </div>
                        )}

                        {/* Timestamp */}
                        <div className="text-right mt-4">
                            <span
                                className="mini-text text-gray"
                                style={{ fontSize: "10.5px", color: "#64748b" }}
                            >
                                {time}
                            </span>
                        </div>
                    </div>

                    {/* Action Button Below Bubble */}
                    <div className="mt-10" style={{ maxWidth: "94%" }}>
                        {isPromotion && (
                            <button
                                type="button"
                                className="w-full py-8 px-12 rounded-10 bg-white flex items-center justify-center gap-6 cursor-pointer border-0 d-shadow"
                                style={{
                                    color: "#0284c7",
                                    border: "1px solid #e2e8f0",
                                    fontWeight: "600",
                                    fontSize: "13.5px",
                                }}
                            >
                                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                    <polyline points="17 1 21 5 17 9" />
                                    <path d="M3 11V9a4 4 0 0 1 4-4h14" />
                                    <polyline points="7 23 3 19 7 15" />
                                    <path d="M21 13v2a4 4 0 0 1-4 4H3" />
                                </svg>
                                <span>{formData.buttonLabel || "SHOP"}</span>
                            </button>
                        )}

                        {isOtp && (
                            <button
                                type="button"
                                className="w-full py-8 px-12 rounded-10 bg-white flex items-center justify-center gap-8 cursor-pointer border-0 d-shadow"
                                style={{
                                    color: "#0284c7",
                                    border: "1px solid #e2e8f0",
                                    fontWeight: "600",
                                    fontSize: "13.5px",
                                }}
                            >
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                                    <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                                    <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
                                </svg>
                                <span>{formData.buttonLabel || "Copy Code"}</span>
                            </button>
                        )}

                        {isWelcome && (
                            <button
                                type="button"
                                className="w-full py-8 px-12 rounded-10 bg-white flex items-center justify-center gap-6 cursor-pointer border-0 d-shadow"
                                style={{
                                    color: "#0284c7",
                                    border: "1px solid #e2e8f0",
                                    fontWeight: "600",
                                    fontSize: "13.5px",
                                }}
                            >
                                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                                    <polyline points="15 3 21 3 21 9" />
                                    <line x1="10" y1="14" x2="21" y2="3" />
                                </svg>
                                <span>{formData.buttonLabel || "Shop now"}</span>
                            </button>
                        )}
                    </div>
                </div>
            </div>

            <div className="flex items-center gap-6 mt-10 text-gray mini-text">
                <span>ⓘ</span>
                <span>Variables are filled with sample values here.</span>
            </div>
        </div>
    );
});
WhatsappTemplateMockup.displayName = "WhatsappTemplateMockup";

// Helper to format URLs in SMS text as blue clickable links
export const formatSmsBody = (text) => {
    if (!text) return "";
    const urlRegex = /(https?:\/\/[^\s]+)/g;
    const parts = text.split(urlRegex);
    return parts.map((part, i) => {
        if (part.match(urlRegex)) {
            return (
                <span
                    key={i}
                    style={{
                        color: "#2563eb",
                        wordBreak: "break-all",
                    }}
                >
                    {part}
                </span>
            );
        }
        return part;
    });
};

// Full SMS Phone Mockup (matching the reference screenshots)
export const SmsTemplateMockup = React.memo(
    ({ templateType = "promotion", formData = {}, sampleUserName = "Aarav" }) => {
        const isOtp = templateType === "otp";
        const isPromotion = templateType === "promotion";

        const defaultBody = isOtp
            ? `${formData.otpCode || "546372"} is your Company verification code. Do not share this code with anyone.`
            : isPromotion
                ? `Hi ${sampleUserName}, enjoy 20% OFF on select items at Company. Valid till 30 Nov 2026. Shop: https://yourbrand.in/s/x7Qa Reply STOP to opt out`
                : `Hi ${sampleUserName}, welcome to Company! Enjoy 10% off your first order with code WELCOME10 at https://yourbrand.in/welcome Reply STOP to opt out`;

        const bodyText = formData.body || defaultBody;

        return (
            <div style={{ maxWidth: "380px", margin: "0 auto" }}>
                {/* Phone outer frame with dark border */}
                <div
                    className="overflow-hidden d-shadow"
                    style={{
                        backgroundColor: "#f1f3f7",
                        border: "4px solid #1e293b",
                        borderRadius: "26px",
                        boxShadow:
                            "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)",
                    }}
                >
                    {/* White Top Header Area */}
                    <div
                        className="pt-20 pb-12 px-16 flex flex-column items-center justify-center bg-white"
                        style={{ borderBottom: "1px solid #e2e8f0" }}
                    >
                        {/* Circle Avatar */}
                        <div
                            className="rounded-full flex items-center justify-center font-700 text-white select-none"
                            style={{
                                width: 44,
                                height: 44,
                                backgroundColor: "#cbd5e1",
                                color: "#ffffff",
                                fontSize: "19px",
                                fontWeight: "700",
                            }}
                        >
                            C
                        </div>

                        {/* Sender Name */}
                        <p
                            className="font-700 text-dark uppercase tracking-wider mt-6 select-none"
                            style={{
                                fontSize: "13px",
                                color: "#1e293b",
                                letterSpacing: "0.8px",
                                fontWeight: "700",
                            }}
                        >
                            COMPNY
                        </p>
                    </div>

                    {/* Message Body Area */}
                    <div className="p-16 pt-14 pb-24" style={{ minHeight: "170px" }}>
                        {/* Centered Timestamp */}
                        <div className="text-center mb-12">
                            <span
                                className="mini-text text-gray font-500"
                                style={{
                                    color: "#94a3b8",
                                    fontSize: "11.5px",
                                }}
                            >
                                Today 11:23 AM
                            </span>
                        </div>

                        {/* Received Message Bubble */}
                        <div
                            className="p-14 px-16 select-text"
                            style={{
                                backgroundColor: "#e2e5eb",
                                borderRadius: "18px",
                                maxWidth: "96%",
                                boxShadow: "0 1px 2px rgba(0,0,0,0.03)",
                            }}
                        >
                            <p
                                className="small-text text-dark"
                                style={{
                                    color: "#0f172a",
                                    fontSize: "13.5px",
                                    lineHeight: "1.5",
                                    wordBreak: "break-word",
                                    margin: 0,
                                }}
                            >
                                {formatSmsBody(bodyText)}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Bottom Caption */}
                <div className="flex items-center gap-6 mt-10 text-gray mini-text">
                    <span>ⓘ</span>
                    <span>Variables are filled with sample values here.</span>
                </div>
            </div>
        );
    }
);
SmsTemplateMockup.displayName = "SmsTemplateMockup";

// Full Gmail Template Mockup (matching the reference screenshots)
export const GmailTemplateMockup = React.memo(
    ({ templateType = "promotion", formData = {}, sampleUserName = "Aarav" }) => {
        const isOtp = templateType === "otp";
        const isPromotion = templateType === "promotion";
        const isWelcome = !isOtp && !isPromotion;

        const defaultFrom = isOtp
            ? "no-reply@yourbrand.in"
            : isPromotion
                ? "offers@yourbrand.in"
                : "welcome@yourbrand.in";
        const rawEmail = formData.fromEmail || defaultFrom;
        const senderEmail = rawEmail.startsWith("<") ? rawEmail : `<${rawEmail}>`;

        const defaultSubject = isOtp
            ? `${formData.otpCode || "546372"} is your verification code`
            : isPromotion
                ? `${sampleUserName}, enjoy 20% OFF – limited time only`
                : `Welcome to Company 🎉 Your 10% off is inside`;

        const subjectText = formData.subject || defaultSubject;
        const time = isOtp ? "11:23 AM" : isPromotion ? "11:23 AM" : "10:17 AM";

        return (
            <div style={{ maxWidth: "480px", margin: "0 auto" }}>
                {/* Gmail Window Container */}
                <div
                    className="rounded-16 overflow-hidden d-shadow bg-white"
                    style={{
                        border: "1px solid #e2e8f0",
                        boxShadow: "0 4px 20px rgba(0, 0, 0, 0.06)",
                    }}
                >
                    {/* Top Inbox Bar */}
                    <div
                        className="px-16 py-8 flex items-center justify-between"
                        style={{
                            backgroundColor: "#f8fafc",
                            borderBottom: "1px solid #f1f5f9",
                        }}
                    >
                        <span
                            className="mini-text font-600 text-gray"
                            style={{ fontSize: "11px", color: "#64748b" }}
                        >
                            Inbox
                        </span>
                        <span
                            className="mini-text text-gray"
                            style={{ fontSize: "11px", color: "#64748b" }}
                        >
                            Preview as seen in Gmail
                        </span>
                    </div>

                    {/* Subject Line Row */}
                    <div className="p-16 pb-10 flex items-center gap-8 flex-wrap">
                        <h4
                            className="small-text font-700 text-dark leading-tight"
                            style={{
                                fontSize: "16px",
                                fontWeight: "700",
                                color: "#0f172a",
                                margin: 0,
                            }}
                        >
                            {subjectText}
                        </h4>
                        <span
                            className="px-6 py-1 rounded-4 font-600 mini-text"
                            style={{
                                backgroundColor: "#e2e8f0",
                                color: "#475569",
                                fontSize: "10px",
                            }}
                        >
                            Inbox
                        </span>
                    </div>

                    {/* Sender Info Row */}
                    <div className="px-16 pb-12 flex items-center justify-between">
                        <div className="flex items-center gap-10">
                            {/* Teal Avatar C */}
                            <div
                                className="rounded-full flex items-center justify-center font-700 text-white flex-shrink-0"
                                style={{
                                    width: 36,
                                    height: 36,
                                    backgroundColor: "#0d9488",
                                    fontSize: "16px",
                                }}
                            >
                                C
                            </div>
                            <div>
                                <div className="flex items-center gap-6">
                                    <span
                                        className="small-text font-700 text-dark"
                                        style={{ fontSize: "13px", color: "#0f172a" }}
                                    >
                                        Company
                                    </span>
                                    <span
                                        className="mini-text text-gray"
                                        style={{ fontSize: "11.5px", color: "#64748b" }}
                                    >
                                        {senderEmail}
                                    </span>
                                </div>
                                <p
                                    className="mini-text text-gray"
                                    style={{ fontSize: "11px", color: "#64748b", margin: 0 }}
                                >
                                    to me
                                </p>
                            </div>
                        </div>

                        <span
                            className="mini-text text-gray"
                            style={{ fontSize: "11.5px", color: "#64748b" }}
                        >
                            {time}
                        </span>
                    </div>

                    {/* Outer Card Body Wrapper with subtle tint */}
                    <div
                        className="p-16"
                        style={{
                            backgroundColor: "#f4f7f5",
                            borderTop: "1px solid #f1f5f9",
                        }}
                    >
                        {/* 1. PROMOTION TEMPLATE (Image 1) */}
                        {isPromotion && (
                            <div
                                className="rounded-12 overflow-hidden bg-white d-shadow"
                                style={{ border: "1px solid #e2e8f0" }}
                            >
                                {/* Special Offer Banner */}
                                {formData.bannerIncluded !== false && (
                                    <div style={{ padding: "10px 10px 0" }}>
                                        {formData.bannerImageUrl ? (
                                            <div style={{ borderRadius: "10px", overflow: "hidden", maxHeight: "160px" }}>
                                                <img
                                                    src={formData.bannerImageUrl}
                                                    alt="Special Offer Banner"
                                                    style={{ width: "100%", height: "auto", maxHeight: "160px", objectFit: "cover", display: "block" }}
                                                />
                                            </div>
                                        ) : (
                                            <WhatsappSpecialOfferBanner />
                                        )}
                                    </div>
                                )}

                                <div className="p-16 pt-10">
                                    <p className="small-text text-dark mb-10" style={{ fontSize: "13px" }}>
                                        Hi {sampleUserName},
                                    </p>
                                    {formData.body ? (
                                        <div
                                            className="small-text text-dark mb-16"
                                            style={{
                                                fontSize: "13px",
                                                lineHeight: "1.5",
                                                whiteSpace: "pre-line",
                                            }}
                                        >
                                            {formData.body}
                                        </div>
                                    ) : (
                                        <>
                                            <p className="small-text text-dark mb-6" style={{ fontSize: "13px", lineHeight: "1.5" }}>
                                                Enjoy <strong>20% OFF</strong> on select items at Company.
                                            </p>
                                            <p className="small-text text-dark mb-16" style={{ fontSize: "13px", lineHeight: "1.5" }}>
                                                This limited-time offer is valid until 30 Nov 2026.
                                            </p>
                                        </>
                                    )}

                                    {/* Green CTA Button matching Nodemailer buildCampaignHtml */}
                                    {(formData.buttonLabel || isPromotion) && (
                                        <button
                                            type="button"
                                            onClick={() => {
                                                if (formData.buttonUrl) window.open(formData.buttonUrl, "_blank");
                                            }}
                                            className="px-20 py-10 rounded-8 font-700 small-text text-white border-0 cursor-pointer transition-all"
                                            style={{
                                                backgroundColor: "#047857",
                                                color: "#ffffff",
                                                fontWeight: "700",
                                                fontSize: "13.5px",
                                                boxShadow: "0 2px 4px rgba(4, 120, 87, 0.2)",
                                            }}
                                        >
                                            {formData.buttonLabel || "Shop now"}
                                        </button>
                                    )}
                                </div>

                                {/* Footer */}
                                <div
                                    className="p-12 text-center mini-text text-gray"
                                    style={{
                                        borderTop: "1px solid #f1f5f9",
                                        backgroundColor: "#ffffff",
                                        fontSize: "11px",
                                        color: "#64748b",
                                    }}
                                >
                                    You received this because you opted in.{" "}
                                    <span style={{ textDecoration: "underline", cursor: "pointer" }}>
                                        Unsubscribe
                                    </span>
                                </div>
                            </div>
                        )}

                        {/* 2. OTP TEMPLATE (Image 2) */}
                        {isOtp && (
                            <div
                                className="rounded-12 overflow-hidden bg-white p-20 d-shadow"
                                style={{ border: "1px solid #e2e8f0" }}
                            >
                                <p className="small-text text-dark mb-12" style={{ fontSize: "13.5px" }}>
                                    Hi {sampleUserName},
                                </p>
                                <p className="small-text text-dark mb-12" style={{ fontSize: "13.5px" }}>
                                    Your verification code is
                                </p>

                                {/* Big OTP Numbers */}
                                <div className="my-16">
                                    <h2
                                        className="font-800 text-dark"
                                        style={{
                                            fontSize: "36px",
                                            fontWeight: "800",
                                            letterSpacing: "8px",
                                            color: "#0f172a",
                                            fontFamily: "monospace, system-ui",
                                            margin: 0,
                                        }}
                                    >
                                        {formData.otpCode || "546372"}
                                    </h2>
                                </div>

                                <p
                                    className="small-text text-dark mb-24"
                                    style={{ fontSize: "13px", color: "#334155", lineHeight: "1.5", whiteSpace: "pre-line" }}
                                >
                                    {formData.securityNote ||
                                        formData.body ||
                                        "For your security, do not share this code. It expires in 10 minutes."}
                                </p>

                                <div
                                    className="pt-14 bordh mini-text text-gray"
                                    style={{ fontSize: "11.5px", color: "#64748b" }}
                                >
                                    {formData.footer || "If you did not request this, ignore this email."}
                                </div>
                            </div>
                        )}

                        {/* 3. WELCOME TEMPLATE */}
                        {isWelcome && (
                            <div
                                className="rounded-12 overflow-hidden bg-white d-shadow"
                                style={{ border: "1px solid #e2e8f0" }}
                            >
                                <div
                                    className="p-16 text-center text-white"
                                    style={{ background: "linear-gradient(135deg, #0d9488 0%, #135436 100%)" }}
                                >
                                    <h3 className="mid-text font-700 text-white mb-4">
                                        Welcome to Company
                                    </h3>
                                    <p className="small-text text-white" style={{ opacity: 0.9 }}>
                                        We're so glad you're here
                                    </p>
                                </div>

                                <div className="p-16 text-center">
                                    <p className="small-text font-500 text-dark">
                                        Hi <strong>{sampleUserName}</strong>, thanks for joining us!
                                    </p>
                                    <p className="small-text text-dark mt-2">
                                        Enjoy <strong style={{ color: "#16a34a" }}>10% off</strong> your first order with code WELCOME10.
                                    </p>

                                    <button
                                        type="button"
                                        className="w-full mt-14 py-9 rounded-8 font-600 small-text text-white border-0 cursor-pointer"
                                        style={{ backgroundColor: "#135436" }}
                                    >
                                        {formData.buttonLabel || "Shop now"} →
                                    </button>
                                </div>

                                <div
                                    className="p-10 text-center mini-text text-gray"
                                    style={{ borderTop: "1px solid #f1f5f9", fontSize: "11px", color: "#64748b" }}
                                >
                                    You received this because you opted in. <span style={{ textDecoration: "underline" }}>Unsubscribe</span>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Subtitle / Note */}
                {isOtp && (
                    <p className="mini-text text-gray mt-8 mb-2" style={{ fontSize: "11.5px", color: "#64748b" }}>
                        Inbox preview text: "{formData.previewText || "For your security, do not share this code."}"
                    </p>
                )}
                <div className="flex items-center gap-6 mt-4 text-gray mini-text">
                    <span>ⓘ</span>
                    <span>Variables are filled with sample values here.</span>
                </div>
            </div>
        );
    }
);
GmailTemplateMockup.displayName = "GmailTemplateMockup";

