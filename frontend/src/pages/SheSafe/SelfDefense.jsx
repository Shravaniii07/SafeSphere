import React, { useState } from "react";
import { Shield, Eye, Zap } from "lucide-react";


// ✅ Card Component
const DefenseCard = ({ icon: Icon, title, desc, video }) => {
  return (
    <div className="bg-white rounded-2xl shadow-sm hover:shadow-md transition border border-slate-100 overflow-hidden">
      
      {/* Content */}
      <div className="p-5">
        <div className="flex items-center justify-between mb-3">
          <Icon className="text-blue-500 w-6 h-6" />
          <span className="text-xs px-3 py-1 bg-blue-100 text-blue-600 rounded-full">
            Self Defense
          </span>
        </div>

        <h3 className="font-semibold text-slate-800 text-lg">
          {title}
        </h3>

        <p className="text-slate-500 text-sm mt-2 line-clamp-2">
          {desc}
        </p>
      </div>

      {/* ✅ FIXED VIDEO */}
      <iframe
        className="w-full h-48"
        src={video}
        title={title}
        frameBorder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
      ></iframe>
    </div>
  );
};


// ✅ Main Page
const SelfDefense = () => {
  const [search, setSearch] = useState("");

  const techniques = [
    {
      icon: Shield,
      title: "Escape from Wrist Grab",
      desc: "Learn how to twist and break free quickly if someone grabs your hand.",
      // video: "https://www.youtube.com/embed/1E6p3g7F8Rk",
      video: "https://www.youtube.com/embed/9m-x64bKfR4",
    },
    {
      icon: Eye,
      title: "Situational Awareness",
      desc: "Train yourself to observe surroundings and detect danger early.",
      video: "https://www.youtube.com/embed/9m-x64bKfR4",
    },
    {
      icon: Zap,
      title: "Quick Reaction Moves",
      desc: "Use fast movements to create space and escape safely.",
      video: "https://www.youtube.com/embed/KVpxP3ZZtAc",
    },
  ];

  // ✅ Search Filter
  const filteredTechniques = techniques.filter((item) =>
    item.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-8">

      {/* 🔥 HERO */}
      <div className="text-center mb-10">
        <h1 className="text-3xl md:text-4xl font-bold text-slate-800">
          Self Defense Training
        </h1>
        <p className="text-slate-500 mt-2">
          Learn practical techniques to protect yourself and escape danger
        </p>

        {/* 🔍 SEARCH */}
        <div className="mt-6 max-w-md mx-auto">
          <input
            type="text"
            placeholder="Search techniques..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>
      </div>

      {/* 🔥 GRID */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredTechniques.length > 0 ? (
          filteredTechniques.map((item, index) => (
            <DefenseCard key={index} {...item} />
          ))
        ) : (
          <p className="text-center col-span-full text-slate-500">
            No techniques found...
          </p>
        )}
      </div>

      {/* ⚠️ PRINCIPLES */}
      <div className="mt-12 bg-white p-6 rounded-2xl shadow border border-slate-100">
        <h2 className="text-xl font-semibold text-slate-800 mb-4">
          Basic Self Defense Principles
        </h2>

        <ul className="list-disc pl-6 text-slate-500 space-y-2">
          <li>Stay alert and aware of your surroundings</li>
          <li>Maintain safe distance from strangers</li>
          <li>Use your voice to attract attention</li>
          <li>Escape quickly — don’t try to fight unnecessarily</li>
        </ul>
      </div>

      {/* 🚨 SAFETY NOTE */}
      <div className="mt-6 bg-red-100 text-red-600 p-4 rounded-xl text-center">
        Self-defense is for escape and protection only. Always prioritize safety.
      </div>

    </div>
  );
};

export default SelfDefense;


// import React, { useState } from "react";
// import { Shield, Eye, Zap } from "lucide-react";


// // ✅ Card Component
// const DefenseCard = ({ icon: Icon, title, desc, video }) => {
//   return (
//     <div className="bg-white rounded-2xl shadow-sm hover:shadow-md transition border border-slate-100 overflow-hidden">
      
//       {/* Content */}
//       <div className="p-5">
//         <div className="flex items-center justify-between mb-3">
//           <Icon className="text-blue-500 w-6 h-6" />
//           <span className="text-xs px-3 py-1 bg-blue-100 text-blue-600 rounded-full">
//             Self Defense
//           </span>
//         </div>

//         <h3 className="font-semibold text-slate-800 text-lg">
//           {title}
//         </h3>

//         <p className="text-slate-500 text-sm mt-2 line-clamp-2">
//           {desc}
//         </p>
//       </div>

//       {/* Video */}
//       <iframe
//         className="w-full h-48"
//         src={video}
//         title={title}
//         allowFullScreen
//       ></iframe>
//     </div>
//   );
// };


// // ✅ Main Page
// const SelfDefense = () => {
//   const [search, setSearch] = useState("");

//   const techniques = [
//     {
//       icon: Shield,
//       title: "Escape from Wrist Grab",
//       desc: "Learn how to twist and break free quickly if someone grabs your hand.",
//       video: "https://www.youtube.com/embed/j7SxpqJ4l2M",
//     },
//     {
//       icon: Eye,
//       title: "Situational Awareness",
//       desc: "Train yourself to observe surroundings and detect danger early.",
//       video: "https://www.youtube.com/embed/7zfm4J7eF4M",
//     },
//     {
//       icon: Zap,
//       title: "Quick Reaction Moves",
//       desc: "Use fast movements to create space and escape safely.",
//       video: "https://www.youtube.com/embed/ksyVPZQvm2A",
//     },
//   ];

//   // ✅ Search Filter
//   const filteredTechniques = techniques.filter((item) =>
//     item.title.toLowerCase().includes(search.toLowerCase())
//   );

//   return (
//     <div className="min-h-screen bg-slate-50 p-4 md:p-8">

//       {/* 🔥 HERO */}
//       <div className="text-center mb-10">
//         <h1 className="text-3xl md:text-4xl font-bold text-slate-800">
//           Self Defense Training
//         </h1>
//         <p className="text-slate-500 mt-2">
//           Learn practical techniques to protect yourself and escape danger
//         </p>

//         {/* 🔍 SEARCH */}
//         <div className="mt-6 max-w-md mx-auto">
//           <input
//             type="text"
//             placeholder="Search techniques..."
//             value={search}
//             onChange={(e) => setSearch(e.target.value)}
//             className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-400"
//           />
//         </div>
//       </div>

//       {/* 🔥 GRID */}
//       <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
//         {filteredTechniques.length > 0 ? (
//           filteredTechniques.map((item, index) => (
//             <DefenseCard key={index} {...item} />
//           ))
//         ) : (
//           <p className="text-center col-span-full text-slate-500">
//             No techniques found...
//           </p>
//         )}
//       </div>

//       {/* ⚠️ PRINCIPLES */}
//       <div className="mt-12 bg-white p-6 rounded-2xl shadow border border-slate-100">
//         <h2 className="text-xl font-semibold text-slate-800 mb-4">
//           Basic Self Defense Principles
//         </h2>

//         <ul className="list-disc pl-6 text-slate-500 space-y-2">
//           <li>Stay alert and aware of your surroundings</li>
//           <li>Maintain safe distance from strangers</li>
//           <li>Use your voice to attract attention</li>
//           <li>Escape quickly — don’t try to fight unnecessarily</li>
//         </ul>
//       </div>

//       {/* 🚨 SAFETY NOTE */}
//       <div className="mt-6 bg-red-100 text-red-600 p-4 rounded-xl text-center">
//         Self-defense is for escape and protection only. Always prioritize safety.
//       </div>

//     </div>
//   );
// };

// export default SelfDefense;
