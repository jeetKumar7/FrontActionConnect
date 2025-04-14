import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
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
} from "react-icons/fa";
import { getUserProfile, getSupportedCauses, addSupportedCause, removeSupportedCause } from "../services";
import { causes } from "../data/causes";

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

// Questions by section
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
  const [userName, setUserName] = useState("");
  const [step, setStep] = useState(-1); // Start at intro screen (-1)
  const [currentSection, setCurrentSection] = useState(null);
  const [answers, setAnswers] = useState({});
  const [showResults, setShowResults] = useState(false);
  const [matchedCauses, setMatchedCauses] = useState([]);
  const [sectionProgress, setSectionProgress] = useState({});
  const [isTransitioning, setIsTransitioning] = useState(false);

  // State for supported causes
  const [supportedCauses, setSupportedCauses] = useState([]);
  const [causeActionLoading, setCauseActionLoading] = useState({});
  const [actionFeedback, setActionFeedback] = useState({ message: "", type: "" });

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

  // Handle supporting a cause
  const handleSupportCause = async (causeId, causeTitle) => {
    // Check if already supported to toggle
    const isAlreadySupported = supportedCauses.includes(causeId.toString());

    // Set loading for this specific cause
    setCauseActionLoading((prev) => ({ ...prev, [causeId]: true }));

    try {
      let response;

      if (isAlreadySupported) {
        // Remove support
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
        // Add support
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

  const handleStartQuiz = () => {
    // Start with the first section
    const firstSection = quizSections[0].id;
    setCurrentSection(firstSection);
    setStep(0);
  };

  const handleAnswer = (questionId, answer) => {
    setAnswers((prev) => ({ ...prev, [questionId]: answer }));

    // Update progress for current section
    if (currentSection) {
      const sectionQuestions = questionsBySection[currentSection];

      // Get all question IDs for the current section
      const sectionQuestionIds = sectionQuestions.map((q) => q.id);

      // Count how many questions from this section have been answered
      // Include the current answer being added
      const answeredQuestions = new Set(
        [...Object.keys(answers), questionId].filter((id) => sectionQuestionIds.includes(id))
      );

      const answeredCount = answeredQuestions.size;

      // Calculate percentage
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
    // Calculate scores based on quiz answers
    const causeScores = causes.map((cause) => {
      // Start with a lower base score to allow for more differentiation
      let score = 20;

      // Interest section matches (q1-q3)
      if (answers.q1) {
        const selectedInterests = Array.isArray(answers.q1) ? answers.q1 : [answers.q1];
        // Match environmental interests with related causes
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

      // Values section (q4-q6)
      if (answers.q4) {
        if (answers.q4 === "future" && cause.id === "1") score += 15;
        if (answers.q4 === "biodiversity" && (cause.id === "2" || cause.id === "3")) score += 15;
        if (answers.q4 === "justice" && cause.id === "5") score += 15;
        if (answers.q4 === "community" && cause.id === "7") score += 15;
      }

      // Actions section (q7-q9)
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

      // Scale of impact preference (q10)
      if (answers.q10) {
        if (answers.q10 === "local" && cause.tags.some((tag) => tag.toLowerCase().includes("community"))) {
          score += 10;
        }
        if (answers.q10 === "global" && cause.tags.some((tag) => tag.toLowerCase().includes("global"))) {
          score += 10;
        }
      }

      // Type of change preference (q12)
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
                    ? "bg-gradient-to-r from-blue-500/20 to-purple-500/20 border-2 border-blue-500"
                    : "bg-white/5 hover:bg-white/10 border border-white/10"
                }`}
                onClick={() => handleAnswer(question.id, option.value)}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <div className="mr-4 flex-shrink-0">
                  <div
                    className={`w-6 h-6 rounded-full border ${
                      answers[question.id] === option.value
                        ? "border-blue-500 bg-blue-500 flex items-center justify-center"
                        : "border-white/30"
                    }`}
                  >
                    {answers[question.id] === option.value && (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4 text-white"
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
            <p className="text-sm text-white/60 mb-2">
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
                        ? "bg-gradient-to-r from-blue-500/30 to-purple-500/30 border-blue-500"
                        : "bg-white/5 hover:bg-white/10"
                    } border border-white/10`}
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
                  ? `bg-${section.color}-500/30 text-${section.color}-400 border-2 border-${section.color}-500`
                  : idx < quizSections.findIndex((s) => s.id === currentSection)
                  ? "bg-green-500/20 text-green-400"
                  : "bg-white/10 text-white/40"
              }`}
            >
              {React.createElement(section.icon)}
            </div>
            <div className="h-1 w-full bg-white/10 rounded-full overflow-hidden">
              <div
                className={`h-full ${
                  currentSection === section.id
                    ? "bg-gradient-to-r from-blue-500 to-purple-500"
                    : idx < quizSections.findIndex((s) => s.id === currentSection)
                    ? "bg-green-500"
                    : "bg-transparent"
                }`}
                style={{ width: `${sectionProgress[section.id] || 0}%` }}
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
        <div className="flex justify-between text-sm text-white/60 mb-1">
          <span>Your progress</span>
          <span>{overallProgress}% complete</span>
        </div>
        <div className="h-2 w-full bg-white/10 rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-gradient-to-r from-blue-500 to-purple-500"
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
    <div className="absolute inset-0 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm z-10 rounded-2xl">
      <div className="flex flex-col items-center">
        <FaSpinner className="text-3xl text-blue-400 animate-spin mb-3" />
        <p className="text-white/80">Loading next question...</p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 to-slate-800 text-white pt-20">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-r from-blue-600 to-purple-600 py-16 overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff06_1px,transparent_1px),linear-gradient(to_bottom,#ffffff06_1px,transparent_1px)] bg-[size:14px_24px]" />
        <div className="relative max-w-5xl mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <motion.h1
              className="text-4xl md:text-5xl font-bold mb-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              {userName ? `${userName}, Discover Your Passion` : "Discover Your Passion"}
            </motion.h1>
            <motion.p
              className="text-xl text-white/80 mb-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              Take our interactive quiz to find causes that align with your values and interests
            </motion.p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 py-12">
        {/* Feedback message for cause support actions */}
        <AnimatePresence>
          {actionFeedback.message && (
            <motion.div
              className={`fixed top-24 right-4 z-50 p-4 rounded-lg shadow-lg ${
                actionFeedback.type === "success"
                  ? "bg-green-500/80"
                  : actionFeedback.type === "error"
                  ? "bg-red-500/80"
                  : "bg-blue-500/80"
              } backdrop-blur-sm text-white`}
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
              className="bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 p-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <div className="text-center mb-8">
                <div className="w-20 h-20 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
                  <FaLightbulb className="text-3xl text-blue-400" />
                </div>
                <h2 className="text-2xl font-bold mb-4">Ready to Find Your Environmental Passion?</h2>
                <p className="text-white/70 max-w-xl mx-auto">
                  This interactive quiz will help match you with environmental and social causes that align with your
                  values, interests, and preferred ways of making a difference. The quiz takes about 5-7 minutes to
                  complete.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                {quizSections.map((section) => (
                  <div key={section.id} className="bg-white/5 rounded-xl p-4 flex items-start gap-4">
                    <div className={`p-3 rounded-lg bg-${section.color}-500/20 text-${section.color}-400`}>
                      {React.createElement(section.icon)}
                    </div>
                    <div>
                      <h3 className="font-medium mb-1">{section.title}</h3>
                      <p className="text-sm text-white/60">{section.description}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex justify-center">
                <motion.button
                  onClick={handleStartQuiz}
                  className="px-8 py-3 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl text-lg font-medium hover:from-blue-600 hover:to-purple-600 shadow-lg hover:shadow-xl transition-all"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Start the Quiz
                </motion.button>
              </div>
            </motion.div>
          )}

          {!showResults && step >= 0 && (
            <div className="relative">
              {isTransitioning && <LoadingQuestionIndicator />}
              <motion.div
                key={`question-${currentSection}-${step}`}
                className="bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 p-8 flex flex-col min-h-[500px]"
                initial={{ opacity: 0, x: isTransitioning ? 20 : 0 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                {renderProgressBar()}
                {renderSectionProgress()}

                {currentSectionData && (
                  <div className="mb-6">
                    <div className="flex items-center gap-2 text-lg font-medium mb-1">
                      <div className={`text-${currentSectionData.color}-400`}>
                        {React.createElement(currentSectionData.icon)}
                      </div>
                      <h2>{currentSectionData.title}</h2>
                    </div>
                    <p className="text-white/60 text-sm">{currentSectionData.description}</p>
                  </div>
                )}

                {/* Question - Add flex-1 to push navigation to the bottom */}
                {currentQuestion && (
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold mb-6">{currentQuestion.question}</h3>
                    {renderQuestionByType(currentQuestion)}
                  </div>
                )}

                {/* Navigation - Always at the bottom */}
                <div className="flex justify-between mt-6 pt-4 border-t border-white/10">
                  <motion.button
                    onClick={previousQuestion}
                    className={`px-6 py-2.5 rounded-lg flex items-center gap-2 ${
                      step === 0 && currentSection === quizSections[0].id
                        ? "opacity-50 cursor-not-allowed"
                        : "bg-white/10 hover:bg-white/20"
                    }`}
                    whileHover={step === 0 && currentSection === quizSections[0].id ? {} : { x: -5 }}
                    whileTap={step === 0 && currentSection === quizSections[0].id ? {} : { scale: 0.95 }}
                    disabled={step === 0 && currentSection === quizSections[0].id}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path
                        fillRule="evenodd"
                        d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                    Back
                  </motion.button>

                  <div className="text-sm text-white/50">
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
                        ? "bg-blue-500/50 cursor-not-allowed"
                        : "bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600"
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
                    {step === questionsBySection[currentSection]?.length - 1 &&
                    currentSection === quizSections[quizSections.length - 1].id
                      ? "See Results"
                      : "Continue"}
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path
                        fillRule="evenodd"
                        d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
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
              <div className="bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 p-8 text-center">
                <motion.div
                  className="w-20 h-20 mx-auto mb-4 bg-gradient-to-r from-green-500/20 to-emerald-500/20 rounded-full flex items-center justify-center"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", delay: 0.2 }}
                >
                  <FaLeaf className="text-3xl text-green-400" />
                </motion.div>
                <h2 className="text-3xl font-bold mb-2">Your Matched Causes</h2>
                <p className="text-white/70 mb-4 max-w-xl mx-auto">
                  Based on your responses, we've identified these causes that align with your values and interests.
                </p>

                {/* Only keep Retake Quiz button */}
                <div className="flex justify-center mb-8">
                  <button
                    onClick={() => {
                      setStep(-1);
                      setShowResults(false);
                      setAnswers({});
                    }}
                    className="px-4 py-2 bg-white/5 hover:bg-white/10 rounded-lg transition-colors"
                  >
                    Retake Quiz
                  </button>
                </div>
              </div>

              <motion.div
                className="grid grid-cols-1 lg:grid-cols-2 gap-6"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                {matchedCauses.map((cause, index) => (
                  <motion.div
                    key={cause.id}
                    className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10 h-full"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 + 0.4 }}
                    whileHover={{ y: -5, boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.2)" }}
                  >
                    <div className="flex flex-col h-full">
                      <div className="flex items-start gap-4 mb-4">
                        <div
                          className={`p-4 rounded-lg ${sectionColorMap[cause.color] || "bg-blue-500/20 text-blue-400"}`}
                        >
                          <cause.icon className="w-6 h-6" />
                        </div>
                        <div>
                          <div className="flex items-center justify-between">
                            <h3 className="text-xl font-semibold">{cause.title}</h3>
                            <div className="ml-auto flex items-center gap-1 px-2 py-1 rounded-full bg-green-500/20 text-green-400">
                              <span className="text-sm font-medium">{cause.matchScore}%</span>
                              <span className="text-xs">match</span>
                            </div>
                          </div>
                          <p className="text-white/60 text-sm mt-1">{cause.description}</p>
                        </div>
                      </div>

                      {/* Tags section with improved styling */}
                      <div className="flex flex-wrap gap-2 mb-4">
                        {cause.tags.map((tag, index) => (
                          <span
                            key={index}
                            className="px-3 py-1 rounded-full text-xs bg-white/5 border border-white/10"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>

                      {/* Support button with improved visual feedback */}
                      <div className="mt-auto pt-4 border-t border-white/10">
                        <div className="flex flex-wrap justify-between items-center gap-3 mb-3">
                          <h4 className="font-medium">How You Can Help</h4>
                          <motion.button
                            onClick={() => handleSupportCause(cause.id, cause.title)}
                            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm transition-colors ${
                              supportedCauses.includes(cause.id.toString())
                                ? "bg-green-500/30 text-green-400 border border-green-500/50"
                                : "bg-white/10 hover:bg-white/20"
                            }`}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            disabled={causeActionLoading[cause.id]}
                          >
                            {causeActionLoading[cause.id] ? (
                              <FaSpinner className="animate-spin" />
                            ) : supportedCauses.includes(cause.id.toString()) ? (
                              <>
                                <FaCheck /> Supporting
                              </>
                            ) : (
                              <>
                                <FaPlus /> Support Cause
                              </>
                            )}
                          </motion.button>
                        </div>

                        {/* Rest of the cause card content */}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </motion.div>

              {/* View All Supported Causes */}
              {supportedCauses.length > 0 && (
                <motion.div
                  className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                >
                  <h3 className="text-xl font-semibold mb-4">Your Supported Causes</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {supportedCauses.map((causeId) => {
                      const cause = causes.find((c) => c.id.toString() === causeId);
                      if (!cause) return null;

                      return (
                        <motion.div
                          key={causeId}
                          className="flex items-center gap-3 p-3 bg-white/5 rounded-lg"
                          whileHover={{ scale: 1.03 }}
                        >
                          <div className={`p-2 rounded-lg bg-${cause.color}-500/20`}>
                            <cause.icon className={`w-4 h-4 text-${cause.color}-400`} />
                          </div>
                          <span>{cause.title}</span>
                          <button
                            onClick={() => handleSupportCause(cause.id, cause.title)}
                            className="ml-auto text-red-400 hover:text-red-300"
                            disabled={causeActionLoading[cause.id]}
                          >
                            {causeActionLoading[cause.id] ? <FaSpinner className="animate-spin" /> : "×"}
                          </button>
                        </motion.div>
                      );
                    })}
                  </div>
                </motion.div>
              )}

              <div className="mt-8 text-center">
                <h3 className="text-2xl font-semibold mb-4">Ready to Take Action?</h3>
                <div className="flex flex-wrap justify-center gap-4">
                  <motion.button
                    className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center gap-2 hover:from-blue-600 hover:to-purple-600 transition-colors"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => (window.location.href = "/hub")}
                  >
                    Go to Action Hub <FaArrowRight />
                  </motion.button>
                  <motion.button
                    className="px-6 py-3 bg-white/10 rounded-lg flex items-center gap-2 hover:bg-white/20 transition-colors"
                    whileHover={{ scale: 1.05 }}
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
    </div>
  );
};

export default FindPassion;
