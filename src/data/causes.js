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
} from "react-icons/fa";

// Export the causes array
export const causes = [
  {
    id: "1",
    title: "Climate Action",
    icon: FaLeaf,
    color: "green",
    description: "Combat climate change and its impacts through education, innovation, and policy advocacy",
    tags: ["Environmental", "Sustainability", "Clean Energy", "Policy"],
    category: "environmental",
    keyQuestions: [1, 4, 7, 12, 18],
    actions: [
      "Join climate policy advocacy groups",
      "Volunteer for reforestation projects",
      "Support renewable energy initiatives",
      "Participate in climate awareness campaigns",
    ],
    organizations: ["350.org", "Climate Reality Project", "Fridays For Future"],
    resources: [
      { type: "Article", title: "Understanding Carbon Neutrality", url: "/library?search=carbon+neutrality" },
      { type: "Video", title: "Climate Solutions in Action", url: "/library?type=video&topic=climate" },
    ],
  },
  {
    id: "2",
    title: "Ocean Conservation",
    icon: FaWater,
    color: "blue",
    description: "Protect marine ecosystems, reduce ocean pollution, and advocate for sustainable fishing practices",
    tags: ["Environmental", "Marine Life", "Conservation", "Pollution"],
    category: "environmental",
    keyQuestions: [1, 5, 8, 13, 19],
    actions: [
      "Participate in beach clean-ups",
      "Support sustainable fishing initiatives",
      "Join marine conservation organizations",
      "Reduce single-use plastic consumption",
    ],
    organizations: ["Ocean Conservancy", "Sea Shepherd", "Surfrider Foundation"],
    resources: [
      { type: "Book", title: "Blue Mind: The Surprising Science", url: "/library?type=book&topic=ocean" },
      { type: "Documentary", title: "Our Blue Planet", url: "/library?type=video&topic=ocean" },
    ],
  },
  {
    id: "3",
    title: "Sustainable Agriculture",
    icon: FaSeedling,
    color: "emerald",
    description: "Support eco-friendly farming, improve food security, and promote regenerative agricultural practices",
    tags: ["Food Security", "Farming", "Sustainability", "Community"],
    category: "environmental",
    keyQuestions: [1, 6, 9, 14, 20],
    actions: [
      "Support local farmers markets",
      "Volunteer at community gardens",
      "Advocate for regenerative agriculture policies",
      "Reduce food waste in your household",
    ],
    organizations: ["Soil Association", "Regeneration International", "Farm Aid"],
    resources: [
      { type: "Guide", title: "Starting Your Own Garden", url: "/library?search=garden+guide" },
      { type: "Course", title: "Introduction to Permaculture", url: "/library?type=course&topic=permaculture" },
    ],
  },
  {
    id: "4",
    title: "Wildlife Protection",
    icon: FaPaw,
    color: "orange",
    description: "Preserve endangered species, protect critical habitats, and combat wildlife trafficking",
    tags: ["Conservation", "Animals", "Biodiversity", "Protection"],
    category: "environmental",
    keyQuestions: [2, 5, 8, 15, 21],
    actions: [
      "Support wildlife sanctuaries",
      "Volunteer for habitat restoration",
      "Report wildlife trafficking",
      "Adopt wildlife-friendly practices",
    ],
    organizations: ["World Wildlife Fund", "Wildlife Conservation Society", "Jane Goodall Institute"],
    resources: [
      { type: "Documentary", title: "Our Planet", url: "/library?type=video&topic=wildlife" },
      { type: "Report", title: "Endangered Species Status Report", url: "/library?type=report&topic=endangered" },
    ],
  },
  {
    id: "5",
    title: "Education Equity",
    icon: FaGraduationCap,
    color: "indigo",
    description: "Promote access to quality education for all, especially marginalized communities",
    tags: ["Education", "Equality", "Youth", "Empowerment"],
    category: "social",
    keyQuestions: [3, 6, 10, 16, 22],
    actions: [
      "Tutor underprivileged students",
      "Donate educational materials",
      "Advocate for education policy reform",
      "Support scholarship programs",
    ],
    organizations: ["Teach For All", "UNICEF Education", "Room to Read"],
    resources: [
      { type: "Article", title: "Closing the Education Gap", url: "/library?search=education+gap" },
      { type: "Tool", title: "Online Learning Resources", url: "/library?type=tool&topic=education" },
    ],
  },
  {
    id: "6",
    title: "Homelessness Support",
    icon: FaHome,
    color: "yellow",
    description: "Address housing insecurity, provide support services, and advocate for housing policy reform",
    tags: ["Housing", "Poverty", "Community", "Advocacy"],
    category: "social",
    keyQuestions: [3, 7, 11, 17, 23],
    actions: [
      "Volunteer at homeless shelters",
      "Support housing-first initiatives",
      "Donate basic necessities",
      "Advocate for affordable housing policies",
    ],
    organizations: ["National Alliance to End Homelessness", "Habitat for Humanity", "Shelter"],
    resources: [
      { type: "Report", title: "State of Homelessness", url: "/library?type=report&topic=homelessness" },
      { type: "Guide", title: "How to Help the Homeless", url: "/library?search=help+homeless" },
    ],
  },
  {
    id: "7",
    title: "Food Security",
    icon: FaUtensils,
    color: "red",
    description: "Combat hunger, reduce food waste, and build sustainable food systems for communities in need",
    tags: ["Hunger", "Community", "Sustainability", "Health"],
    category: "social",
    keyQuestions: [4, 8, 12, 18, 24],
    actions: [
      "Volunteer at food banks",
      "Start a community garden",
      "Advocate for food assistance programs",
      "Organize food recovery initiatives",
    ],
    organizations: ["Feeding America", "World Food Programme", "Food Rescue US"],
    resources: [
      { type: "Article", title: "Reducing Food Waste", url: "/library?search=food+waste" },
      { type: "Video", title: "Food Security Solutions", url: "/library?type=video&topic=food+security" },
    ],
  },
  {
    id: "8",
    title: "Racial Justice",
    icon: FaBalanceScale,
    color: "purple",
    description:
      "Dismantle systemic racism, promote equity, and build inclusive communities through advocacy and education",
    tags: ["Equality", "Justice", "Advocacy", "Community"],
    category: "social",
    keyQuestions: [4, 9, 13, 19, 25],
    actions: [
      "Support anti-racism education",
      "Advocate for policy reform",
      "Amplify marginalized voices",
      "Join community dialogue initiatives",
    ],
    organizations: ["Black Lives Matter", "NAACP", "Race Forward"],
    resources: [
      { type: "Book", title: "How to Be an Antiracist", url: "/library?type=book&topic=racial+justice" },
      { type: "Podcast", title: "Code Switch", url: "/library?type=podcast&topic=racial+justice" },
    ],
  },
];

// Helper function to find a cause by ID
export const getCauseById = (id) => {
  return causes.find((cause) => cause.id === id);
};

// Helper function to get multiple causes by IDs
export const getCausesByIds = (ids) => {
  return causes.filter((cause) => ids.includes(cause.id));
};

export default causes;
