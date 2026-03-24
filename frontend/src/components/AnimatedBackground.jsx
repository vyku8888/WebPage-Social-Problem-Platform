import { useCallback } from "react";
import Particles from "@tsparticles/react";
import { loadSlim } from "@tsparticles/slim";

const AnimatedBackground = () => {
    const particlesInit = useCallback(async (engine) => {
        await loadSlim(engine);
    }, []);

    return (
        <Particles
            id="tsparticles"
            init={particlesInit}
            className="fixed inset-0 w-full h-full pointer-events-none"
            style={{ zIndex: -5 }}
            options={{
                background: {
                    color: {
                        value: "transparent",
                    },
                },
                fpsLimit: 120,
                interactivity: {
                    events: {
                        onHover: { enable: true, mode: "grab" },
                        resize: true,
                    },
                    modes: {
                        grab: { distance: 140, links: { opacity: 0.5 } },
                    },
                },
                particles: {
                    color: { value: ["#3b82f6", "#6366f1", "#0ea5e9"] },
                    links: {
                        color: "#94a3b8",
                        distance: 150,
                        enable: true,
                        opacity: 0.3,
                        width: 1.5,
                    },
                    move: {
                        direction: "none",
                        enable: true,
                        outModes: { default: "bounce" },
                        random: true,
                        speed: 1.2,
                        straight: false,
                    },
                    number: {
                        density: { enable: true, area: 800 },
                        value: 60,
                    },
                    opacity: { value: 0.6 },
                    shape: { type: "circle" },
                    size: { value: { min: 2, max: 4 } },
                },
                detectRetina: true,
            }}
        />
    );
};

export default AnimatedBackground;
