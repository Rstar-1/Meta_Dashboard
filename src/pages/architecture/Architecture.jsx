import React, { useState, useCallback } from "react";
import Projects from "./sections/Projects";
import Structure from "./sections/Structure";

const Architecture = () => {
    const [currentView, setCurrentView] = useState("projects");
    const [selectedProject, setSelectedProject] = useState(null);

    const handleOpenStructure = useCallback((project) => {
        setSelectedProject(project);
        setCurrentView("structure");
    }, []);

    const handleBackToProjects = useCallback(() => {
        setCurrentView("projects");
    }, []);

    if (currentView === "structure") {
        return (
            <Structure
                project={selectedProject}
                onBack={handleBackToProjects}
            />
        );
    }

    return <Projects onOpenStructure={handleOpenStructure} />;
};

export default React.memo(Architecture);
