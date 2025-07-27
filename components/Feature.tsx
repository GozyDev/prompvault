import {
  Archive,
  Repeat,
  Bookmark,
  Image,
  Trash2,
  Search,
  Tag,
  Share2,
  UserCircle,
  ShieldCheck,
} from "lucide-react";

const icons = {
  Archive,
  Repeat,
  Bookmark,
  Image,
  Trash2,
  Search,
  Tag,
  Share2,
  UserCircle,
  ShieldCheck,
};

const features = [
  {
    category: "Prompt Management",
    items: [
      {
        title: "Prompt Vault",
        description: "Save your favorite prompts for easy access anytime",
        icon: "Archive",
        color: "bg-blue-100 text-blue-600",
      },
      {
        title: "Remix Mode",
        description: "Twist existing prompts into something fresh and powerful",
        icon: "Repeat",
        color: "bg-purple-100 text-purple-600",
      },
      {
        title: "Bookmark Anything",
        description: "One tap to save prompts you love, for later inspiration",
        icon: "Bookmark",
        color: "bg-rose-100 text-rose-600",
      },
      {
        title: "Image Prompt Support",
        description: "Use and save image-based prompts for visual AI tools",
        icon: "Image",
        color: "bg-amber-100 text-amber-600",
      },
      {
        title: "Prompt Control",
        description: "Edit or delete your prompts anytime — you stay in charge",
        icon: "Trash2",
        color: "bg-emerald-100 text-emerald-600",
      },
    ],
  },
  {
    category: "Discovery",
    items: [
      {
        title: "Explore Public Prompts",
        description: "See what others are crafting and get inspired",
        icon: "Search",
        color: "bg-indigo-100 text-indigo-600",
      },
      {
        title: "Smart Tags",
        description: "Find prompts by mood, tool, or use-case instantly",
        icon: "Tag",
        color: "bg-sky-100 text-sky-600",
      },
      {
        title: "Share Easily",
        description: "Share your prompts with others or across social media",
        icon: "Share2",
        color: "bg-violet-100 text-violet-600",
      },
    ],
  },
  {
    category: "User Profile",
    items: [
      {
        title: "Your Profile",
        description:
          "Get a personal page showing your public prompts & activity",
        icon: "UserCircle",
        color: "bg-pink-100 text-pink-600",
      },
    ],
  },
  {
    category: "Security",
    items: [
      {
        title: "Private & Secure",
        description: "Your prompts are safe, always — no leaks, no clutter",
        icon: "ShieldCheck",
        color: "bg-green-100 text-green-600",
      },
    ],
  },
];

export default function FeaturePreview() {
  return (
    <div className="py-[100px]" id="features">
      <h2 className="text-3xl sm:text-5xl text-center uppercase font-bold  bg-gradient-to-r from-purple-700 to-blue-800 bg-clip-text text-transparent">
        Features Preview{" "}
      </h2>
      <div className="space-y-16 mt-10">
        {features.map((section) => (
          <div key={section.category} className="group">
            <div className="flex items-center gap-4 mb-6">
              <h2 className="text-sm uppercase font-medium text-gray-700">
                {section.category}
              </h2>
              <div className="h-px flex-grow bg-gradient-to-r from-purple-400/20 to-blue-400/20 group-hover:from-purple-400/40 group-hover:to-blue-400/40 transition-all"></div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
              {section.items.map(({ title, description, icon, color }) => {
                const Icon = icons[icon as keyof typeof icons];
                return (
                  <div
                    key={title}
                    className="border border-gray-200 rounded-2xl p-6 bg-white hover:bg-gradient-to-br hover:from-white hover:to-gray-50 transition-all duration-300 hover:shadow-lg hover:-translate-y-1 group/item"
                  >
                    <div className="flex items-start gap-4">
                      <div className={`${color} p-3 rounded-xl`}>
                        <Icon className="w-6 h-6" />
                      </div>
                      <div>
                        <h3 className="font-bold text-lg mb-2">{title}</h3>
                        <p className="text-gray-600">{description}</p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
