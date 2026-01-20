"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";

// Dynamically import Lottie to avoid SSR issues
const Lottie = dynamic(() => import("lottie-react"), { ssr: false });

const ANIMATIONS = [
    "/animations/basketball-game.json",
    "/animations/bodybuilder.json",
    "/animations/fencing.json",
    "/animations/going-office.json",
    "/animations/gymnastic-rings.json",
    "/animations/harpist.json",
];

interface WelcomeHeroProps {
    userName?: string;
}

export const WelcomeHero = ({ userName = "Beka" }: WelcomeHeroProps) => {
    const [animationData, setAnimationData] = useState<object | null>(null);

    useEffect(() => {
        // Select random animation on mount
        const randomIndex = Math.floor(Math.random() * ANIMATIONS.length);
        const animationPath = ANIMATIONS[randomIndex];

        fetch(animationPath)
            .then((res) => res.json())
            .then((data) => setAnimationData(data))
            .catch((err) => console.error("Failed to load animation:", err));
    }, []);

    return (
        <div className="flex min-h-[400px] items-center justify-between gap-8 px-4 lg:px-0">
            {/* Left side - Welcome text */}
            <div className="flex flex-1 flex-col gap-3">
                <h1 className="text-display-md font-semibold text-primary lg:text-display-lg">
                    Welcome back, {userName}
                </h1>
                <p className="text-lg text-tertiary lg:text-xl">
                    What are you looking for?
                </p>
            </div>

            {/* Right side - Lottie animation */}
            <div className="hidden shrink-0 items-center justify-center lg:flex">
                {animationData && (
                    <Lottie
                        animationData={animationData}
                        loop
                        autoplay
                        style={{ width: 300, height: 300 }}
                    />
                )}
            </div>
        </div>
    );
};
