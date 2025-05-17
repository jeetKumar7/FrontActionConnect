import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion";
import {
  FaLeaf,
  FaWater,
  FaSeedling,
  FaPaw,
  FaHandHoldingHeart,
  FaGraduationCap,
  FaUsers,
  FaHandsHelping,
  FaGlobe,
  FaArrowRight,
  FaLightbulb,
  FaChild,
  FaMedkit,
  FaHome,
  FaUtensils,
  FaHeart,
  FaCity,
  FaTree,
  FaHandsWash,
  FaRecycle,
  FaTint,
  FaSun,
  FaCampground,
  FaBriefcase,
  FaBalanceScale,
  FaPlus,
  FaCheck,
  FaSpinner,
  FaArrowLeft,
  FaArrowDown,
} from "react-icons/fa";
import { getUserProfile, getSupportedCauses, addSupportedCause, removeSupportedCause } from "../services";
import { causes } from "../data/causes";
import { useNavigate } from "react-router-dom";

// Add theme detection hook
const useThemeDetection = () => {
  const [isDarkMode, setIsDarkMode] = useState(true);

  useEffect(() => {
    // Initial theme check
    const isLightMode = document.body.classList.contains("light");
    setIsDarkMode(!isLightMode);

    // Watch for theme changes
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.attributeName === "class") {
          setIsDarkMode(!document.body.classList.contains("light"));
        }
      });
    });

    observer.observe(document.body, { attributes: true });
    return () => observer.disconnect();
  }, []);

  return isDarkMode;
};

// Quiz sections
const quizSections = [
  {
    id: "interests",
    title: "Your Interests",
    description: "Help us understand what environmental and social topics you care about most",
    icon: FaHeart,
    color: "red",
  },
  {
    id: "values",
    title: "Your Values",
    description: "What principles guide your decision-making and priorities",
    icon: FaBalanceScale,
    color: "blue",
  },
  {
    id: "actions",
    title: "Preferred Actions",
    description: "How you prefer to contribute your time, skills, and resources",
    icon: FaHandsHelping,
    color: "green",
  },
  {
    id: "impact",
    title: "Desired Impact",
    description: "The difference you want to make in the world through your involvement",
    icon: FaGlobe,
    color: "purple",
  },
];

// Questions by section - keeping the existing questions
const questionsBySection = {
  interests: [
    {
      id: "q1",
      question: "Which environmental issues concern you the most?",
      type: "multiple-select",
      options: [
        { value: "climate", label: "Climate change" },
        { value: "oceans", label: "Ocean conservation" },
        { value: "forests", label: "Forests and biodiversity" },
        { value: "pollution", label: "Pollution and waste" },
        { value: "wildlife", label: "Wildlife protection" },
        { value: "agriculture", label: "Sustainable agriculture" },
      ],
      maxSelections: 3,
    },
    {
      id: "q2",
      question: "Which social issues are you most passionate about?",
      type: "multiple-select",
      options: [
        { value: "education", label: "Education equity" },
        { value: "poverty", label: "Poverty and homelessness" },
        { value: "hunger", label: "Food security" },
        { value: "equality", label: "Racial and social justice" },
        { value: "health", label: "Healthcare access" },
        { value: "community", label: "Community development" },
      ],
      maxSelections: 3,
    },
    {
      id: "q3",
      question: "What aspect of environmentalism interests you most?",
      type: "single-select",
      options: [
        { value: "conservation", label: "Protecting natural resources" },
        { value: "innovation", label: "Developing sustainable technologies" },
        { value: "education", label: "Environmental education and awareness" },
        { value: "policy", label: "Policy and advocacy" },
        { value: "restoration", label: "Ecosystem restoration" },
      ],
    },
  ],
  values: [
    {
      id: "q4",
      question: "Which principle resonates with you most strongly?",
      type: "single-select",
      options: [
        { value: "future", label: "Protecting the planet for future generations" },
        { value: "balance", label: "Balancing human needs with environmental protection" },
        { value: "justice", label: "Environmental justice and equity" },
        { value: "biodiversity", label: "Preserving biodiversity and natural systems" },
        { value: "community", label: "Building sustainable communities" },
      ],
    },
    {
      id: "q5",
      question: "How do you view the relationship between economic growth and environmental protection?",
      type: "single-select",
      options: [
        {
          value: "compatible",
          label: "They can be compatible with the right policies and technologies",
        },
        {
          value: "priority",
          label: "Environmental protection should take priority over economic growth",
        },
        {
          value: "balanced",
          label: "We need to find a middle ground between the two",
        },
        {
          value: "reimagine",
          label: "We need to reimagine economic systems entirely",
        },
      ],
    },
    {
      id: "q6",
      question: "When making ethical decisions, which of these factors is most important to you?",
      type: "single-select",
      options: [
        { value: "fairness", label: "Fairness and equality" },
        { value: "compassion", label: "Compassion and caring" },
        { value: "responsibility", label: "Personal responsibility" },
        { value: "future", label: "Long-term consequences" },
        { value: "community", label: "Community well-being" },
      ],
    },
  ],
  actions: [
    {
      id: "q7",
      question: "How would you prefer to contribute to causes you care about?",
      type: "multiple-select",
      options: [
        { value: "volunteer", label: "Volunteering time and skills" },
        { value: "donate", label: "Financial contributions" },
        { value: "advocate", label: "Advocacy and raising awareness" },
        { value: "lifestyle", label: "Lifestyle changes and personal actions" },
        { value: "organize", label: "Organizing community initiatives" },
        { value: "creative", label: "Creative projects or artistic activism" },
      ],
      maxSelections: 3,
    },
    {
      id: "q8",
      question: "What type of volunteer activities interest you most?",
      type: "multiple-select",
      options: [
        { value: "handson", label: "Hands-on field work (cleaning, planting, building)" },
        { value: "education", label: "Education and awareness (teaching, workshops)" },
        { value: "admin", label: "Administrative support and planning" },
        { value: "tech", label: "Technical skills (website, design, data analysis)" },
        { value: "community", label: "Community organizing and events" },
        { value: "advocacy", label: "Advocacy and policy work" },
      ],
      maxSelections: 3,
    },
    {
      id: "q9",
      question: "How much time could you realistically commit to environmental or social causes?",
      type: "single-select",
      options: [
        { value: "occasional", label: "Occasional events (a few times per year)" },
        { value: "monthly", label: "Monthly commitment (a few hours per month)" },
        { value: "weekly", label: "Weekly involvement (a few hours per week)" },
        { value: "daily", label: "Daily actions integrated into my lifestyle" },
        { value: "career", label: "Career-focused (full-time or significant part-time)" },
      ],
    },
  ],
  impact: [
    {
      id: "q10",
      question: "What scale of impact do you most want to focus on?",
      type: "single-select",
      options: [
        { value: "individual", label: "Individual level (personal relationships and interactions)" },
        { value: "local", label: "Local community (neighborhood, city)" },
        { value: "regional", label: "Regional (state, province, or region)" },
        { value: "national", label: "National (country-wide issues and policies)" },
        { value: "global", label: "Global (international cooperation and systems)" },
      ],
    },
    {
      id: "q11",
      question: "Which timeframe for impact is most important to you?",
      type: "single-select",
      options: [
        { value: "immediate", label: "Immediate impact (within months)" },
        { value: "shortterm", label: "Short-term impact (1-2 years)" },
        { value: "mediumterm", label: "Medium-term impact (3-5 years)" },
        { value: "longterm", label: "Long-term impact (5+ years)" },
        { value: "generational", label: "Generational impact (decades)" },
      ],
    },
    {
      id: "q12",
      question: "What type of change do you most want to be part of?",
      type: "single-select",
      options: [
        { value: "direct", label: "Direct environmental improvement (restoration, conservation)" },
        { value: "behavior", label: "Behavior and attitude change" },
        { value: "policy", label: "Policy and systemic change" },
        { value: "innovation", label: "Technological or social innovation" },
        { value: "education", label: "Education and awareness building" },
      ],
    },
  ],
};

const FindPassion = () => {
  const isDarkMode = useThemeDetection();

  const [userName, setUserName] = useState("");
  const [step, setStep] = useState(-1); // Start at intro screen (-1)
  const [currentSection, setCurrentSection] = useState(null);
  const [answers, setAnswers] = useState({});
  const [showResults, setShowResults] = useState(false);
  const [matchedCauses, setMatchedCauses] = useState([]);
  const [sectionProgress, setSectionProgress] = useState({});
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0.5, y: 0.5 });
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  // State for supported causes
  const [supportedCauses, setSupportedCauses] = useState([]);
  const [causeActionLoading, setCauseActionLoading] = useState({});
  const [actionFeedback, setActionFeedback] = useState({ message: "", type: "" });

  // Parallax scrolling effect
  const sectionRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  });

  const contentY = useTransform(scrollYProgress, [0, 1], [0, -15]);
  const opacity = useTransform(scrollYProgress, [0, 0.3], [1, 0.6]);

  const sectionColorMap = {
    red: "bg-red-500/20 text-red-400",
    blue: "bg-blue-500/20 text-blue-400",
    green: "bg-green-500/20 text-green-400",
    purple: "bg-purple-500/20 text-purple-400",
    yellow: "bg-yellow-500/20 text-yellow-400",
    orange: "bg-orange-500/20 text-orange-400",
    teal: "bg-teal-500/20 text-teal-400",
    indigo: "bg-indigo-500/20 text-indigo-400",
    pink: "bg-pink-500/20 text-pink-400",
    gray: "bg-gray-500/20 text-gray-400",
  };

  // Get user data and supported causes if available
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userData = await getUserProfile();
        if (userData && !userData.error && userData.name) {
          setUserName(userData.name.split(" ")[0]); // Just use first name
        }

        // Fetch the user's supported causes
        const causes = await getSupportedCauses();
        if (!causes.error) {
          setSupportedCauses(causes);
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchUserData();
  }, []);

  // Mouse tracking with improved smoothing
  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePosition((prev) => ({
        x: prev.x + (e.clientX / window.innerWidth - prev.x) * 0.03,
        y: prev.y + (e.clientY / window.innerHeight - prev.y) * 0.03,
      }));
    };

    let animationFrameId;
    const updateMousePosition = () => {
      animationFrameId = requestAnimationFrame(updateMousePosition);
    };
    updateMousePosition();

    window.addEventListener("mousemove", handleMouseMove);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  // Check for mobile devices
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Handle supporting a cause - keeping existing functionality
  const handleSupportCause = async (causeId, causeTitle) => {
    // Existing functionality
    const isAlreadySupported = supportedCauses.includes(causeId.toString());
    setCauseActionLoading((prev) => ({ ...prev, [causeId]: true }));

    try {
      let response;

      if (isAlreadySupported) {
        response = await removeSupportedCause(causeId.toString());
        if (!response.error) {
          setSupportedCauses(response.supportedCauses || []);
          setActionFeedback({
            message: `You've removed ${causeTitle} from your supported causes`,
            type: "info",
          });
        } else {
          setActionFeedback({
            message: response.error,
            type: "error",
          });
        }
      } else {
        response = await addSupportedCause(causeId.toString());
        if (!response.error) {
          setSupportedCauses(response.supportedCauses || []);
          setActionFeedback({
            message: `You're now supporting ${causeTitle}!`,
            type: "success",
          });
        } else {
          setActionFeedback({
            message: response.error,
            type: "error",
          });
        }
      }

      // Clear feedback message after 3 seconds
      setTimeout(() => {
        setActionFeedback({ message: "", type: "" });
      }, 3000);
    } catch (error) {
      console.error("Error managing supported cause:", error);
      setActionFeedback({
        message: "There was an error. Please try again.",
        type: "error",
      });
    } finally {
      // Clear loading state for this cause
      setCauseActionLoading((prev) => ({ ...prev, [causeId]: false }));
    }
  };

  // Initialize section progress
  useEffect(() => {
    const progress = {};
    quizSections.forEach((section) => {
      progress[section.id] = 0;
    });
    setSectionProgress(progress);
  }, []);

  // Quiz navigation and progress functionality - keeping existing behavior
  const handleStartQuiz = () => {
    const firstSection = quizSections[0].id;
    setCurrentSection(firstSection);
    setStep(0);
  };

  const handleAnswer = (questionId, answer) => {
    setAnswers((prev) => ({ ...prev, [questionId]: answer }));

    // Update progress for current section
    if (currentSection) {
      const sectionQuestions = questionsBySection[currentSection];
      const sectionQuestionIds = sectionQuestions.map((q) => q.id);
      const answeredQuestions = new Set(
        [...Object.keys(answers), questionId].filter((id) => sectionQuestionIds.includes(id))
      );
      const answeredCount = answeredQuestions.size;
      const progress = Math.min(Math.round((answeredCount / sectionQuestions.length) * 100), 100);

      setSectionProgress((prev) => ({
        ...prev,
        [currentSection]: progress,
      }));
    }
  };

  const nextQuestion = () => {
    // Check if current question is answered
    const currentQuestion = getCurrentQuestion();
    if (!currentQuestion) return;

    if (!answers[currentQuestion.id] && currentQuestion.type !== "multiple-select") {
      // Require an answer for non-multiple-select questions
      return;
    }

    // Handle section transitions
    const sectionQuestions = questionsBySection[currentSection];
    const currentIndex = sectionQuestions.findIndex((q) => q.id === currentQuestion.id);

    if (currentIndex < sectionQuestions.length - 1) {
      // Move to next question in current section
      setIsTransitioning(true);
      setTimeout(() => {
        setStep(step + 1);
        setIsTransitioning(false);
      }, 300);
    } else {
      // Move to next section or results
      const currentSectionIndex = quizSections.findIndex((s) => s.id === currentSection);

      if (currentSectionIndex < quizSections.length - 1) {
        // Move to next section
        const nextSection = quizSections[currentSectionIndex + 1].id;
        setIsTransitioning(true);
        setTimeout(() => {
          setCurrentSection(nextSection);
          setStep(0); // Reset step for new section
          setIsTransitioning(false);
        }, 300);
      } else {
        // Calculate results
        calculateResults();
      }
    }
  };

  const previousQuestion = () => {
    if (step > 0) {
      setIsTransitioning(true);
      setTimeout(() => {
        setStep(step - 1);
        setIsTransitioning(false);
      }, 300);
    } else {
      // Go back to previous section
      const currentSectionIndex = quizSections.findIndex((s) => s.id === currentSection);
      if (currentSectionIndex > 0) {
        const prevSection = quizSections[currentSectionIndex - 1].id;
        const prevSectionQuestions = questionsBySection[prevSection];
        setIsTransitioning(true);
        setTimeout(() => {
          setCurrentSection(prevSection);
          setStep(prevSectionQuestions.length - 1); // Go to last question of previous section
          setIsTransitioning(false);
        }, 300);
      }
    }
  };

  const getCurrentQuestion = () => {
    if (!currentSection) return null;
    const sectionQuestions = questionsBySection[currentSection] || [];
    return sectionQuestions[step];
  };

  const calculateResults = () => {
    // Calculate scores based on quiz answers - keeping existing logic
    const causeScores = causes.map((cause) => {
      // Start with a base score
      let score = 20;

      // Interest section matches
      if (answers.q1) {
        const selectedInterests = Array.isArray(answers.q1) ? answers.q1 : [answers.q1];

        if (cause.category === "environmental") {
          if (
            selectedInterests.includes("climate") &&
            cause.tags.some((tag) => tag.toLowerCase().includes("climate"))
          ) {
            score += 15;
          }
          if (selectedInterests.includes("oceans") && cause.tags.some((tag) => tag.toLowerCase().includes("ocean"))) {
            score += 15;
          }
          if (
            selectedInterests.includes("wildlife") &&
            cause.tags.some((tag) => tag.toLowerCase().includes("wildlife"))
          ) {
            score += 15;
          }
          if (selectedInterests.includes("forests") && cause.tags.some((tag) => tag.toLowerCase().includes("forest"))) {
            score += 15;
          }
          if (
            selectedInterests.includes("pollution") &&
            cause.tags.some((tag) => tag.toLowerCase().includes("pollution"))
          ) {
            score += 15;
          }
        }

        // Match social interests with related causes
        if (cause.category === "social") {
          if (
            selectedInterests.includes("education") &&
            cause.tags.some((tag) => tag.toLowerCase().includes("education"))
          ) {
            score += 15;
          }
          if (
            selectedInterests.includes("poverty") &&
            cause.tags.some((tag) => tag.toLowerCase().includes("poverty"))
          ) {
            score += 15;
          }
          if (
            selectedInterests.includes("equality") &&
            cause.tags.some((tag) => tag.toLowerCase().includes("justice"))
          ) {
            score += 15;
          }
        }
      }

      // Values section (q4-q6) - keeping existing logic
      if (answers.q4) {
        if (answers.q4 === "future" && cause.id === "1") score += 15;
        if (answers.q4 === "biodiversity" && (cause.id === "2" || cause.id === "3")) score += 15;
        if (answers.q4 === "justice" && cause.id === "5") score += 15;
        if (answers.q4 === "community" && cause.id === "7") score += 15;
      }

      // Actions section (q7-q9) - keeping existing logic
      if (answers.q7) {
        const preferredActions = Array.isArray(answers.q7) ? answers.q7 : [answers.q7];

        // Match volunteer preference with volunteer-focused causes
        if (
          preferredActions.includes("volunteer") &&
          cause.tags.some((tag) => tag.toLowerCase().includes("volunteer"))
        ) {
          score += 10;
        }

        // Match advocacy preference with advocacy-focused causes
        if (preferredActions.includes("advocate") && cause.tags.some((tag) => tag.toLowerCase().includes("advocacy"))) {
          score += 10;
        }
      }

      // Scale of impact preference (q10) - keeping existing logic
      if (answers.q10) {
        if (answers.q10 === "local" && cause.tags.some((tag) => tag.toLowerCase().includes("community"))) {
          score += 10;
        }
        if (answers.q10 === "global" && cause.tags.some((tag) => tag.toLowerCase().includes("global"))) {
          score += 10;
        }
      }

      // Type of change preference (q12) - keeping existing logic
      if (answers.q12) {
        if (answers.q12 === "direct" && cause.id === "2") score += 10; // Ocean conservation
        if (answers.q12 === "policy" && cause.id === "5") score += 10; // Climate policy
        if (answers.q12 === "education" && cause.id === "6") score += 10; // Environmental education
      }

      // Normalize score to 0-100 range
      score = Math.min(Math.max(score, 0), 100);

      return {
        ...cause,
        matchScore: Math.round(score),
      };
    });

    // Sort by match score and take top matches
    const topMatches = causeScores.sort((a, b) => b.matchScore - a.matchScore).slice(0, 4);

    setMatchedCauses(topMatches);
    setShowResults(true);
  };

  const renderQuestionByType = (question) => {
    if (!question) return null;

    switch (question.type) {
      case "single-select":
        return (
          <div className="space-y-4">
            {question.options.map((option, index) => (
              <motion.button
                key={index}
                className={`w-full p-4 rounded-xl text-left transition-all flex items-center ${
                  answers[question.id] === option.value
                    ? isDarkMode
                      ? "bg-gradient-to-r from-indigo-500/20 to-purple-500/20 border-2 border-indigo-500"
                      : "bg-gradient-to-r from-indigo-100 to-purple-100 border-2 border-indigo-500"
                    : isDarkMode
                    ? "bg-white/5 hover:bg-white/10 border border-white/10"
                    : "bg-white hover:bg-slate-50 border border-slate-200"
                }`}
                onClick={() => handleAnswer(question.id, option.value)}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <div className="mr-4 flex-shrink-0">
                  <div
                    className={`w-6 h-6 rounded-full border ${
                      answers[question.id] === option.value
                        ? "border-indigo-500 bg-indigo-500 flex items-center justify-center"
                        : isDarkMode
                        ? "border-white/30"
                        : "border-slate-300"
                    }`}
                  >
                    {answers[question.id] === option.value && (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className={`h-4 w-4 ${isDarkMode ? "text-white" : "text-white"}`}
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                    )}
                  </div>
                </div>
                <div>
                  {option.icon && <span className="text-lg mb-1 block">{React.createElement(option.icon)}</span>}
                  <span className="font-medium">{option.label}</span>
                </div>
              </motion.button>
            ))}
          </div>
        );

      case "multiple-select":
        return (
          <div className="space-y-4">
            <p className={`text-sm ${isDarkMode ? "text-white/60" : "text-slate-500"} mb-2`}>
              {question.maxSelections ? `Select up to ${question.maxSelections} options` : "Select all that apply"}
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {question.options.map((option, index) => {
                const isSelected = Array.isArray(answers[question.id]) && answers[question.id]?.includes(option.value);
                return (
                  <motion.button
                    key={index}
                    className={`p-4 rounded-xl text-left transition-all flex items-center ${
                      isSelected
                        ? isDarkMode
                          ? "bg-gradient-to-r from-indigo-500/30 to-purple-500/30 border-indigo-500"
                          : "bg-gradient-to-r from-indigo-100 to-purple-100 border-indigo-500"
                        : isDarkMode
                        ? "bg-white/5 hover:bg-white/10"
                        : "bg-white hover:bg-slate-50"
                    } border ${isDarkMode ? "border-white/10" : "border-slate-200"}`}
                    onClick={() => {
                      const currentSelections = Array.isArray(answers[question.id]) ? [...answers[question.id]] : [];

                      if (isSelected) {
                        // Remove if already selected
                        handleAnswer(
                          question.id,
                          currentSelections.filter((value) => value !== option.value)
                        );
                      } else if (!question.maxSelections || currentSelections.length < question.maxSelections) {
                        // Add if under the max limit
                        handleAnswer(question.id, [...currentSelections, option.value]);
                      }
                    }}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    {option.icon && <span className="mr-3">{React.createElement(option.icon)}</span>}
                    <span>{option.label}</span>
                  </motion.button>
                );
              })}
            </div>
          </div>
        );

      default:
        return <p>Unsupported question type</p>;
    }
  };

  const renderSectionProgress = () => {
    return (
      <div className="mb-6 grid grid-cols-4 gap-2">
        {quizSections.map((section, idx) => (
          <div key={section.id} className="flex flex-col items-center">
            <div
              className={`w-12 h-12 rounded-full flex items-center justify-center mb-2 ${
                currentSection === section.id
                  ? `bg-${section.color}-${isDarkMode ? "500/30" : "100"} border-2 border-${section.color}-${
                      isDarkMode ? "500" : "500"
                    }`
                  : idx < quizSections.findIndex((s) => s.id === currentSection)
                  ? isDarkMode
                    ? "bg-green-500/20 text-green-400"
                    : "bg-green-100 text-green-600"
                  : isDarkMode
                  ? "bg-white/10 text-white/40"
                  : "bg-slate-100 text-slate-400"
              }`}
            >
              {React.createElement(section.icon, {
                className: currentSection === section.id ? `text-${section.color}-${isDarkMode ? "400" : "600"}` : "",
              })}
            </div>
            <div className={`h-1 w-full ${isDarkMode ? "bg-white/10" : "bg-slate-200"} rounded-full overflow-hidden`}>
              <motion.div
                className={`h-full ${
                  currentSection === section.id
                    ? "bg-gradient-to-r from-indigo-500 to-purple-500"
                    : idx < quizSections.findIndex((s) => s.id === currentSection)
                    ? "bg-green-500"
                    : "bg-transparent"
                }`}
                initial={{ width: 0 }}
                animate={{ width: `${sectionProgress[section.id] || 0}%` }}
                transition={{ duration: 0.5 }}
              />
            </div>
          </div>
        ))}
      </div>
    );
  };

  const renderProgressBar = () => {
    // Calculate overall progress
    const totalQuestions = Object.values(questionsBySection).flat().length;
    const answeredQuestions = Object.keys(answers).length;
    const overallProgress = Math.round((answeredQuestions / totalQuestions) * 100);

    return (
      <div className="mb-6">
        <div className={`flex justify-between text-sm ${isDarkMode ? "text-white/60" : "text-slate-500"} mb-1`}>
          <span>Your progress</span>
          <span>{overallProgress}% complete</span>
        </div>
        <div className={`h-2 w-full ${isDarkMode ? "bg-white/10" : "bg-slate-200"} rounded-full overflow-hidden`}>
          <motion.div
            className="h-full bg-gradient-to-r from-indigo-500 to-purple-500"
            initial={{ width: 0 }}
            animate={{ width: `${overallProgress}%` }}
            transition={{ duration: 0.5 }}
          />
        </div>
      </div>
    );
  };

  const currentQuestion = getCurrentQuestion();
  const currentSectionData = quizSections.find((s) => s.id === currentSection);

  const LoadingQuestionIndicator = () => (
    <div
      className={`absolute inset-0 flex items-center justify-center ${
        isDarkMode ? "bg-slate-900/50" : "bg-white/50"
      } backdrop-blur-sm z-10 rounded-2xl`}
    >
      <div className="flex flex-col items-center">
        <FaSpinner className={`text-3xl ${isDarkMode ? "text-indigo-400" : "text-indigo-600"} animate-spin mb-3`} />
        <p className={isDarkMode ? "text-white/80" : "text-slate-700"}>Loading next question...</p>
      </div>
    </div>
  );
  const navigate = useNavigate();

  // Add a useEffect that triggers after results are calculated
  useEffect(() => {
    if (showResults && matchedCauses.length > 0) {
      // Check if this user is in the onboarding flow
      const isNewUser = localStorage.getItem("isNewUserOnboarding") === "true";

      // Only redirect for new users in onboarding flow
      if (isNewUser) {
        // Set a timeout for redirect so user can see their results first
        const redirectTimer = setTimeout(() => {
          // Store that user has completed onboarding
          localStorage.setItem("hasCompletedPassionQuiz", "true");
          localStorage.setItem("showLocationPrompt", "true");
          localStorage.removeItem("isNewUserOnboarding"); // Clear the flag

          // Navigate to profile page
          navigate("/profile");
        }, 10000); // 10 seconds delay to let user view results

        return () => clearTimeout(redirectTimer);
      }
    }
  }, [showResults, matchedCauses, navigate]);

  return (
    <div
      ref={sectionRef}
      className={`min-h-screen ${
        isDarkMode
          ? "bg-gradient-to-b from-slate-950 via-slate-900 to-indigo-950/80"
          : "bg-gradient-to-b from-white via-slate-50 to-indigo-50/80"
      } text-[var(--text-primary)] pt-20 -mt-8`}
    >
      {/* Background Elements */}
      <div className="absolute inset-0 top-20 z-0 pointer-events-none">
        {/* Subtle noise texture */}
        <div className="absolute inset-0 opacity-[0.015] [mask-image:radial-gradient(ellipse_at_center,black_50%,transparent_100%)]">
          <div className="absolute inset-0 bg-noise"></div>
        </div>

        {/* Gradient accent lights */}
        <div
          className={`absolute -left-1/4 top-1/4 w-1/2 aspect-square rounded-full ${
            isDarkMode ? "bg-indigo-900/20" : "bg-indigo-200/40"
          } blur-[120px]`}
        ></div>
        <div
          className={`absolute -right-1/4 bottom-1/4 w-1/2 aspect-square rounded-full ${
            isDarkMode ? "bg-violet-900/20" : "bg-violet-200/40"
          } blur-[120px]`}
        ></div>

        {/* Responsive glow following cursor */}
        <motion.div
          className="absolute w-[600px] h-[600px] rounded-full blur-[140px] opacity-[0.07] pointer-events-none"
          style={{
            background: isDarkMode
              ? "radial-gradient(circle, rgba(99, 102, 241, 0.4) 0%, rgba(79, 70, 229, 0.2) 40%, transparent 70%)"
              : "radial-gradient(circle, rgba(99, 102, 241, 0.2) 0%, rgba(79, 70, 229, 0.1) 40%, transparent 70%)",
            x: useTransform(() => mousePosition.x * window.innerWidth - 300),
            y: useTransform(() => mousePosition.y * window.innerHeight - 300),
          }}
          transition={{
            type: "spring",
            stiffness: 10,
            damping: 50,
            mass: 3,
          }}
        />
      </div>

      {/* Hero Section */}
      <div className="relative bg-gradient-to-r from-indigo-900/70 to-purple-900/70 py-16 overflow-hidden">
        {/* Background Video */}
        <video className="absolute inset-0 w-full h-full object-cover opacity-80" autoPlay loop muted playsInline>
          <source
            src="https://res.cloudinary.com/dak1w5wyf/video/upload/v1745844567/852435-hd_1920_1080_30fps_knq30q.mp4"
            type="video/mp4"
          />
          Your browser does not support the video tag.
        </video>

        {/* Overlay for better text readability */}
        <div className="absolute inset-0 bg-black/50"></div>

        <motion.div
          className="relative max-w-5xl mx-auto px-4"
          style={{ y: contentY, opacity }}
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="max-w-3xl mx-auto text-center">
            {/* Customized badge matching Hero style */}
            <div
              className={`inline-block px-4 py-1.5 rounded-full ${
                isDarkMode ? "bg-indigo-500/10 border-indigo-500/20" : "bg-indigo-500/10 border-indigo-500/30"
              } border mb-6`}
            >
              <span className={`${isDarkMode ? "text-indigo-300" : "text-indigo-600"} text-sm font-medium`}>
                Find Your Passion
              </span>
            </div>

            <motion.h1
              className="text-4xl md:text-5xl font-bold mb-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              {userName ? (
                <>
                  <span className="text-white">{userName}, Discover Your</span>{" "}
                  <span className={isDarkMode ? "text-indigo-400" : "text-indigo-600"}>Passion</span>
                </>
              ) : (
                <>
                  <span className="text-white">Discover Your</span>{" "}
                  <span className={isDarkMode ? "text-indigo-400" : "text-indigo-600"}>Passion</span>
                </>
              )}
            </motion.h1>
            <motion.p
              className={`text-xl ${isDarkMode ? "text-white/80" : "text-white/80"} mb-8`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              Take our interactive quiz to find causes that align with your values and interests
            </motion.p>
          </div>
        </motion.div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 max-w-4xl mx-auto px-4 py-12">
        {/* Feedback message for cause support actions */}
        <AnimatePresence>
          {actionFeedback.message && (
            <motion.div
              className={`fixed top-24 right-4 z-50 p-4 rounded-lg shadow-lg backdrop-blur-sm text-[var(--text-primary)] ${
                actionFeedback.type === "success"
                  ? "bg-green-500/80"
                  : actionFeedback.type === "error"
                  ? "bg-red-500/80"
                  : "bg-blue-500/80"
              }`}
              initial={{ opacity: 0, y: -20, x: 20 }}
              animate={{ opacity: 1, y: 0, x: 0 }}
              exit={{ opacity: 0, y: -20, x: 20 }}
              transition={{ duration: 0.3 }}
            >
              {actionFeedback.message}
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence mode="wait">
          {step === -1 && !showResults && (
            <motion.div
              key="intro"
              className={`${
                isDarkMode ? "bg-white/5 border-white/10" : "bg-white border-slate-200"
              } backdrop-blur-sm rounded-2xl border p-8 shadow-lg`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <div className="text-center mb-8">
                <div
                  className={`w-20 h-20 ${
                    isDarkMode
                      ? "bg-gradient-to-r from-indigo-500/20 to-purple-500/20"
                      : "bg-gradient-to-r from-indigo-100 to-purple-100"
                  } rounded-full flex items-center justify-center mx-auto mb-6`}
                >
                  <FaLightbulb className={`text-3xl ${isDarkMode ? "text-indigo-400" : "text-indigo-600"}`} />
                </div>
                <h2 className="text-2xl font-bold mb-4">Ready to Find Your Environmental Passion?</h2>
                <p className={`${isDarkMode ? "text-white/70" : "text-slate-600"} max-w-xl mx-auto`}>
                  This interactive quiz will help match you with environmental and social causes that align with your
                  values, interests, and preferred ways of making a difference. The quiz takes about 5-7 minutes to
                  complete.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                {quizSections.map((section) => (
                  <motion.div
                    key={section.id}
                    className={`${
                      isDarkMode ? "bg-white/5 border-white/5" : "bg-slate-50 border-slate-200"
                    } backdrop-blur-sm rounded-xl p-4 flex items-start gap-4 border hover:border-indigo-500/20`}
                    whileHover={{ y: -5, borderColor: "rgba(99, 102, 241, 0.2)" }}
                  >
                    <div
                      className={`p-3 rounded-lg bg-${section.color}-${isDarkMode ? "500/20" : "100"} text-${
                        section.color
                      }-${isDarkMode ? "400" : "600"}`}
                    >
                      {React.createElement(section.icon)}
                    </div>
                    <div>
                      <h3 className="font-medium mb-1">{section.title}</h3>
                      <p className={`text-sm ${isDarkMode ? "text-white/60" : "text-slate-600"}`}>
                        {section.description}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>

              <div className="flex justify-center">
                <motion.button
                  onClick={handleStartQuiz}
                  className="px-8 py-3 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-xl text-lg font-medium text-white shadow-lg hover:shadow-xl transition-all"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <span className="flex items-center gap-2">
                    Start the Quiz
                    <motion.span
                      animate={{ x: [0, 4, 0] }}
                      transition={{
                        duration: 1.5,
                        repeat: Infinity,
                        repeatType: "loop",
                        ease: "easeInOut",
                      }}
                    >
                      <FaArrowRight />
                    </motion.span>
                  </span>
                </motion.button>
              </div>
            </motion.div>
          )}

          {!showResults && step >= 0 && (
            <div className="relative">
              {isTransitioning && <LoadingQuestionIndicator isDarkMode={isDarkMode} />}
              <motion.div
                key={`question-${currentSection}-${step}`}
                className={`${
                  isDarkMode ? "bg-white/5 border-white/10" : "bg-white border-slate-200"
                } backdrop-blur-sm rounded-2xl border p-8 flex flex-col min-h-[500px] shadow-lg`}
                initial={{ opacity: 0, x: isTransitioning ? 20 : 0 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                {/* Progress bars - keep existing renderProgressBar() function but update styling inside it */}
                {renderProgressBar()}
                {renderSectionProgress()}

                {currentSectionData && (
                  <div className="mb-6">
                    <div className="flex items-center gap-2 text-lg font-medium mb-1">
                      <div className={`text-${currentSectionData.color}-${isDarkMode ? "400" : "600"}`}>
                        {React.createElement(currentSectionData.icon)}
                      </div>
                      <h2>{currentSectionData.title}</h2>
                    </div>
                    <p className={`${isDarkMode ? "text-white/60" : "text-slate-600"} text-sm`}>
                      {currentSectionData.description}
                    </p>
                  </div>
                )}

                {/* Question content */}
                {currentQuestion && (
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold mb-6">{currentQuestion.question}</h3>
                    {/* Update renderQuestionByType to use isDarkMode */}
                    {renderQuestionByType(currentQuestion)}
                  </div>
                )}

                {/* Navigation */}
                <div
                  className={`flex justify-between mt-6 pt-4 border-t ${
                    isDarkMode ? "border-white/10" : "border-slate-200"
                  }`}
                >
                  <motion.button
                    onClick={previousQuestion}
                    className={`px-6 py-2.5 rounded-lg flex items-center gap-2 ${
                      step === 0 && currentSection === quizSections[0].id
                        ? "opacity-50 cursor-not-allowed"
                        : isDarkMode
                        ? "bg-white/10 hover:bg-white/20"
                        : "bg-slate-100 hover:bg-slate-200 text-slate-700"
                    }`}
                    whileHover={step === 0 && currentSection === quizSections[0].id ? {} : { x: -5 }}
                    whileTap={step === 0 && currentSection === quizSections[0].id ? {} : { scale: 0.95 }}
                    disabled={step === 0 && currentSection === quizSections[0].id}
                  >
                    <FaArrowLeft className="text-sm" />
                    <span>Back</span>
                  </motion.button>

                  <div className={`text-sm ${isDarkMode ? "text-white/50" : "text-slate-500"}`}>
                    {currentSection && (
                      <>
                        Question {step + 1} of {questionsBySection[currentSection]?.length}
                      </>
                    )}
                  </div>

                  <motion.button
                    onClick={nextQuestion}
                    className={`px-6 py-2.5 rounded-lg flex items-center gap-2 ${
                      !answers[currentQuestion?.id] && currentQuestion?.type !== "multiple-select"
                        ? "bg-indigo-500/50 cursor-not-allowed"
                        : "bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 text-white"
                    }`}
                    whileHover={
                      !answers[currentQuestion?.id] && currentQuestion?.type !== "multiple-select" ? {} : { x: 5 }
                    }
                    whileTap={
                      !answers[currentQuestion?.id] && currentQuestion?.type !== "multiple-select"
                        ? {}
                        : { scale: 0.95 }
                    }
                    disabled={!answers[currentQuestion?.id] && currentQuestion?.type !== "multiple-select"}
                  >
                    <span>
                      {step === questionsBySection[currentSection]?.length - 1 &&
                      currentSection === quizSections[quizSections.length - 1].id
                        ? "See Results"
                        : "Continue"}
                    </span>
                    <FaArrowRight className="text-sm" />
                  </motion.button>
                </div>
              </motion.div>
            </div>
          )}

          {showResults && (
            <motion.div
              key="results"
              className="space-y-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <div
                className={`${
                  isDarkMode ? "bg-white/5 border-white/10" : "bg-white border-slate-200"
                } backdrop-blur-sm rounded-2xl border p-8 text-center shadow-lg`}
              >
                <motion.div
                  className={`w-20 h-20 mx-auto mb-4 ${
                    isDarkMode
                      ? "bg-gradient-to-r from-indigo-500/20 to-purple-500/20"
                      : "bg-gradient-to-r from-indigo-100 to-purple-100"
                  } rounded-full flex items-center justify-center`}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", delay: 0.2 }}
                >
                  <FaLeaf className={`text-3xl ${isDarkMode ? "text-indigo-400" : "text-indigo-600"}`} />
                </motion.div>
                <h2 className="text-3xl font-bold mb-2">Your Matched Causes</h2>
                <p className={`${isDarkMode ? "text-white/70" : "text-slate-600"} mb-4 max-w-xl mx-auto`}>
                  Based on your responses, we've identified these causes that align with your values and interests.
                </p>

                {/* Retake Quiz button */}
                <div className="flex justify-center mb-8">
                  <motion.button
                    onClick={() => {
                      setStep(-1);
                      setShowResults(false);
                      setAnswers({});
                    }}
                    className={`px-4 py-2 ${
                      isDarkMode
                        ? "bg-white/5 hover:bg-white/10 border-white/10 hover:border-white/20"
                        : "bg-slate-100 hover:bg-slate-200 border-slate-200 hover:border-slate-300 text-slate-700"
                    } rounded-lg transition-colors border`}
                    whileHover={{ scale: 1.05, borderColor: isDarkMode ? "rgba(255, 255, 255, 0.2)" : "" }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Retake Quiz
                  </motion.button>
                </div>
              </div>

              {/* Matched causes cards */}
              <motion.div
                className="grid grid-cols-1 lg:grid-cols-2 gap-6"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                {matchedCauses.map((cause, index) => (
                  <motion.div
                    key={cause.id}
                    className={`${
                      isDarkMode ? "bg-white/5 border-white/10" : "bg-white border-slate-200"
                    } backdrop-blur-sm rounded-xl p-6 border h-full shadow-lg`}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 + 0.4 }}
                    whileHover={{ y: -5, boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.2)" }}
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center">
                        <div className={`p-2 rounded-lg mr-3 ${cause.colorClass || "bg-indigo-500/20"}`}>
                          {React.createElement(cause.icon || FaLeaf, {
                            className: `w-5 h-5 ${cause.textColorClass || "text-indigo-400"}`,
                          })}
                        </div>
                        <h3 className="text-lg font-semibold">{cause.title}</h3>
                      </div>
                      <div
                        className={`px-2 py-1 rounded-full text-xs font-medium ${
                          isDarkMode ? "bg-indigo-500/20 text-indigo-300" : "bg-indigo-100 text-indigo-600"
                        }`}
                      >
                        {cause.matchScore}% Match
                      </div>
                    </div>

                    <p className={`mb-4 ${isDarkMode ? "text-white/70" : "text-slate-600"}`}>{cause.description}</p>

                    <div className="flex flex-wrap gap-2 mb-4">
                      {cause.tags?.map((tag, idx) => (
                        <span
                          key={idx}
                          className={`text-xs px-2 py-1 rounded-full ${
                            isDarkMode ? "bg-white/5 text-white/70" : "bg-slate-100 text-slate-600"
                          }`}
                        >
                          {tag}
                        </span>
                      ))}
                    </div>

                    <div className="mt-auto pt-4">
                      <button
                        onClick={() => handleSupportCause(cause.id, cause.title)}
                        disabled={causeActionLoading[cause.id]}
                        className={`w-full py-2 rounded-lg flex items-center justify-center gap-2 ${
                          supportedCauses?.includes(cause.id.toString())
                            ? isDarkMode
                              ? "bg-green-500/20 text-green-400 border border-green-500/30"
                              : "bg-green-100 text-green-700 border border-green-200"
                            : isDarkMode
                            ? "bg-white/10 hover:bg-white/20 text-white"
                            : "bg-slate-100 hover:bg-slate-200 text-slate-700"
                        }`}
                      >
                        {causeActionLoading[cause.id] ? (
                          <FaSpinner className="animate-spin" />
                        ) : supportedCauses?.includes(cause.id.toString()) ? (
                          <>
                            <FaCheck /> Supporting
                          </>
                        ) : (
                          <>
                            <FaPlus /> Support This Cause
                          </>
                        )}
                      </button>
                    </div>
                  </motion.div>
                ))}
              </motion.div>

              {/* Final call to action */}
              <div className="mt-8 text-center">
                <h3 className="text-2xl font-semibold mb-4">Ready to Take Action?</h3>
                <div className="flex flex-wrap justify-center gap-4">
                  <motion.button
                    className="px-6 py-3 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-lg flex items-center gap-2 shadow-lg hover:shadow-xl text-white"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => (window.location.href = "/hub")}
                  >
                    Go to Action Hub
                    <motion.span
                      animate={{ x: [0, 4, 0] }}
                      transition={{
                        duration: 1.5,
                        repeat: Infinity,
                        repeatType: "loop",
                        ease: "easeInOut",
                      }}
                    >
                      <FaArrowRight />
                    </motion.span>
                  </motion.button>
                  <motion.button
                    className={`px-6 py-3 ${
                      isDarkMode
                        ? "bg-white/10 border-white/10 hover:border-white/20"
                        : "bg-slate-100 border-slate-200 hover:border-slate-300 text-slate-700"
                    } rounded-lg flex items-center gap-2 border`}
                    whileHover={{ scale: 1.05, borderColor: isDarkMode ? "rgba(255, 255, 255, 0.2)" : "" }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => (window.location.href = "/community")}
                  >
                    Join the Community <FaUsers />
                  </motion.button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Professional scroll indicator */}
      <motion.div
        className="fixed bottom-8 left-1/2 transform -translate-x-1/2 flex items-center gap-3 text-xs text-indigo-300/90 py-2 px-4 rounded-full bg-indigo-900/10 backdrop-blur-sm border border-indigo-500/10 z-50"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1, duration: 0.5 }}
        style={{ opacity: useTransform(scrollYProgress, [0, 0.05], [1, 0]) }}
      >
        <motion.div
          animate={{
            y: [0, 3, 0],
            opacity: [0.7, 1, 0.7],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="text-indigo-400"
        >
          <FaArrowDown />
        </motion.div>
        <span>Discover Your Passion</span>
      </motion.div>
    </div>
  );
};

export default FindPassion;
