"use client";

import { useEffect } from "react";
import { driver } from "driver.js";
import "driver.js/dist/driver.css";

export function DashboardTour() {
  useEffect(() => {
    // Check if user has seen the tour before
    const hasSeenTour = localStorage.getItem("dashboard-tour-completed");

    if (!hasSeenTour) {
      // Small delay to ensure DOM is ready
      const timer = setTimeout(() => {
        startWelcomeTour();
      }, 1000);

      return () => clearTimeout(timer);
    }
  }, []);

  const startWelcomeTour = () => {
    const driverObj = driver({
      showProgress: true,
      steps: [
        {
          element: "#dashboard-header",
          popover: {
            title: "Welcome to CodeReverb! 👋",
            description:
              "This is your AI-powered code review command center. Let's explore the key areas that will help you review code more effectively.",
          },
        },
        {
          element: "#stats-overview-section",
          popover: {
            title: "Your Review Activity at a Glance 📊",
            description:
              "These cards show your review metrics, repository health, AI accuracy, and time saved through automation. Keep an eye on these to track your productivity!",
          },
        },
        {
          element: "#recent-prs-section",
          popover: {
            title: "Latest Pull Requests 📋",
            description:
              "See all recent pull requests across your repositories. Click any PR to start an AI-powered review that will provide detailed, constructive feedback.",
          },
        },
        {
          element: "#ai-insights-section",
          popover: {
            title: "AI Smart Suggestions 🤖",
            description:
              "This is where CodeReverb's AI shines! Get personalized recommendations, code quality alerts, and persona suggestions based on your review patterns.",
          },
        },
        {
          element: "#repositories-section",
          popover: {
            title: "Manage Your Repositories 🏗️",
            description:
              "Connect new repositories or adjust settings for existing ones. Each repository can have different AI personas and review rules.",
          },
        },
        {
          element: "#review-queue-section",
          popover: {
            title: "Your Review Queue ⏰",
            description:
              "High-priority reviews and team assignments appear here. The AI helps prioritize based on code complexity and importance.",
          },
        },
        {
          element: "#activity-timeline-section",
          popover: {
            title: "Activity Timeline 📅",
            description:
              "Track all your recent activity - completed reviews, AI actions, and repository connections. Great for staying organized!",
          },
        },
      ],
      onDestroyed: () => {
        // Mark tour as completed
        localStorage.setItem("dashboard-tour-completed", "true");
      },
    });

    driverObj.drive();
  };

  // Function to manually restart the tour
  const restartTour = () => {
    localStorage.removeItem("dashboard-tour-completed");
    startWelcomeTour();
  };

  // Expose restart function globally for the help button
  useEffect(() => {
    (window as any).restartDashboardTour = restartTour;
  }, []);

  return null; // This component doesn't render anything
}
