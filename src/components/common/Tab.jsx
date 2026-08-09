const TabItem = ({ name, count, icon, isActive, onClick, padding }) => {
    const paddingClass = padding === 0 || padding === "0" ? "px-10 py-6" : "px-16 py-10";
    return (
        <div
            onClick={onClick}
            className={`${paddingClass} cursor-pointer flex items-center gap-8 flex-shrink-0 tab-item ${isActive ? "active" : "rounded-5"}`}
        >
            {icon && <span className="flex items-center justify-center">{icon}</span>}
            <p className="small-text">{name}</p>
            {count !== undefined && count !== null && (
                <p className={`px-8 py-2 rounded-20 mini-text font-500 ${isActive ? "bg-primary text-white" : "bg-tertiary text-gray"}`}>
                    {count}
                </p>
            )}
        </div>
    );
};

const Tab = ({ tabs, activeTab, onChange, padding }) => {
    return (
        <>
            <style>{`
                .tabs-container::-webkit-scrollbar { display: none; }
                .tab-item { color: var(--gray); font-weight: 500; transition: all 0.2s ease; position: relative; }
                .tab-item:not(.active):hover { background-color: var(--forth); color: var(--dark); }
                .tab-item.active { background-color: #ffffff; color: var(--primary); font-weight: 600; }
                .tab-item.active::after {
                    content: '';
                    position: absolute;
                    bottom: 0;
                    left: 0;
                    right: 0;
                    height: 2px;
                    background-color: var(--primary);
                    border-top-left-radius: 2px;
                    border-top-right-radius: 2px;
                }
            `}</style>
            <div
                className="flex bordb gap-8 tabs-container px-16"
                style={{
                    overflowX: "auto",
                    whiteSpace: "nowrap",
                    scrollbarWidth: "none",
                    msOverflowStyle: "none"
                }}
            >
                {tabs.map((tab, idx) => {
                    const isObj = typeof tab === "object" && tab !== null;
                    const name = isObj ? (tab.name || tab.label) : tab;
                    const value = isObj ? (tab.value || name) : tab;

                    return (
                        <TabItem
                            key={idx}
                            name={name}
                            count={isObj ? tab.count : null}
                            icon={isObj ? tab.icon : null}
                            isActive={activeTab === value}
                            onClick={() => onChange?.(value)}
                            padding={padding}
                        />
                    );
                })}
            </div>
        </>
    );
};

export default Tab;