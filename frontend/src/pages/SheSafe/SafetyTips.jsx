import React, { useState } from "react";
import { MapPin, Briefcase, Moon, Globe } from "lucide-react";

const SafetyTips = () => {
  const [category, setCategory] = useState("traveling");
  const [generatedTip, setGeneratedTip] = useState("");
  const [location, setLocation] = useState("street");
  const [time, setTime] = useState("day");

  const tipsData = {
    traveling: [
      "Share your live location with someone you trust.",
      "Avoid empty or isolated places.",
      "Keep emergency contacts easily accessible.",
    ],
    workplace: [
      "Know all emergency exits in your building.",
      "Report suspicious behavior immediately.",
      "Avoid staying late alone when possible.",
    ],
    night: [
      "Stick to well-lit streets and public areas.",
      "Avoid distractions like phones while walking.",
      "Keep keys ready before reaching your door.",
    ],
    online: [
      "Never share personal information publicly.",
      "Use strong and unique passwords.",
      "Avoid clicking unknown links.",
    ],
  };

  // ✅ Smart Generator
  const generateTip = () => {
    let tip = "";

    if (location === "street" && time === "night") {
      tip = "Stay in well-lit areas and avoid isolated streets.";
    } else if (location === "bus") {
      tip = "Sit near other passengers and stay alert.";
    } else if (location === "office") {
      tip = "Inform someone if you are working late.";
    } else {
      tip = "Always stay aware and trust your instincts.";
    }

    setGeneratedTip(tip);
  };

  // Icons mapping
  const icons = {
    traveling: MapPin,
    workplace: Briefcase,
    night: Moon,
    online: Globe,
  };

  const ActiveIcon = icons[category];

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-8">

      {/* 🔥 HERO */}
      <div className="text-center mb-10">
        <h1 className="text-3xl md:text-4xl font-bold text-slate-800">
          Safety Tips by Situation
        </h1>
        <p className="text-slate-500 mt-2">
          Stay safe with smart tips tailored to your environment
        </p>
      </div>

      {/* 🔥 CATEGORY BUTTONS */}
      <div className="flex gap-3 mb-6 flex-wrap justify-center">
        {Object.keys(tipsData).map((key) => (
          <button
            key={key}
            onClick={() => setCategory(key)}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition ${
              category === key
                ? "bg-pink-500 text-white"
                : "bg-white border border-slate-200 text-slate-600 hover:bg-slate-100"
            }`}
          >
            {key}
          </button>
        ))}
      </div>

      {/* 🔥 TIPS CARD */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 mb-8 max-w-2xl mx-auto">
        <div className="flex items-center gap-3 mb-4">
          <ActiveIcon className="text-blue-500 w-6 h-6" />
          <h2 className="text-xl font-semibold text-slate-800 capitalize">
            {category} Tips
          </h2>
        </div>

        <ul className="list-disc pl-5 text-slate-500 space-y-2">
          {tipsData[category].map((tip, index) => (
            <li key={index}>{tip}</li>
          ))}
        </ul>
      </div>

      {/* 🔥 SMART GENERATOR */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 max-w-2xl mx-auto">
        <h2 className="text-xl font-semibold text-slate-800 mb-4">
          Smart Tip Generator
        </h2>

        <div className="flex flex-col md:flex-row gap-4 mb-4">
          
          <select
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className="p-3 border rounded-xl flex-1"
          >
            <option value="street">Street</option>
            <option value="bus">Bus</option>
            <option value="office">Office</option>
          </select>

          <select
            value={time}
            onChange={(e) => setTime(e.target.value)}
            className="p-3 border rounded-xl flex-1"
          >
            <option value="day">Day</option>
            <option value="night">Night</option>
          </select>

          <button
            onClick={generateTip}
            className="bg-pink-400 hover:bg-pink-500 text-white px-6 py-3 rounded-xl font-semibold transition"
          >
            Generate
          </button>
        </div>

        <div className="bg-slate-100 p-4 rounded-xl text-slate-700">
          {generatedTip || "Your personalized safety tip will appear here"}
        </div>
      </div>

      {/* 🚨 EMERGENCY NOTE */}
      <div className="mt-8 bg-red-100 text-red-600 p-4 rounded-xl text-center max-w-2xl mx-auto">
        In case of danger, use the SOS feature immediately.
      </div>

    </div>
  );
};

export default SafetyTips;



// import React, { useState } from "react";

// const SafetyTips = () => {
//   const [category, setCategory] = useState("traveling");
//   const [generatedTip, setGeneratedTip] = useState("");

//   const tipsData = {
//     traveling: [
//       "Share your location with family.",
//       "Avoid empty areas.",
//       "Keep emergency numbers ready.",
//     ],
//     workplace: [
//       "Know emergency exits.",
//       "Report suspicious behavior.",
//       "Avoid staying late alone.",
//     ],
//     night: [
//       "Stay in well-lit areas.",
//       "Avoid using phone while walking.",
//       "Keep keys ready before reaching home.",
//     ],
//     online: [
//       "Do not share personal info.",
//       "Use strong passwords.",
//       "Avoid unknown links.",
//     ],
//   };

//   const generateTip = () => {
//     const location = document.getElementById("location").value;
//     const time = document.getElementById("time").value;

//     let tip = "";

//     if (location === "street" && time === "night") {
//       tip = "Stay in lit areas and avoid isolated streets.";
//     } else if (location === "bus") {
//       tip = "Sit near other passengers and stay alert.";
//     } else if (location === "office") {
//       tip = "Inform someone if working late.";
//     } else {
//       tip = "Always stay aware and trust your instincts.";
//     }

//     setGeneratedTip(tip);
//   };

//   return (
//     <div className="p-6">
//       {/* Header */}
//       <div className="bg-pink-100 p-6 rounded-xl text-center mb-8">
//         <h1 className="text-3xl font-bold text-pink-600">
//           Safety Tips by Situation
//         </h1>
//       </div>

//       {/* Category Buttons */}
//       <div className="flex gap-3 mb-6 flex-wrap">
//         {Object.keys(tipsData).map((key) => (
//           <button
//             key={key}
//             onClick={() => setCategory(key)}
//             className={`px-4 py-2 rounded-lg ${
//               category === key
//                 ? "bg-pink-500 text-white"
//                 : "bg-gray-200"
//             }`}
//           >
//             {key}
//           </button>
//         ))}
//       </div>

//       {/* Tips Display */}
//       <div className="bg-white p-6 rounded-xl shadow mb-8">
//         <h2 className="text-xl font-semibold mb-3 capitalize">
//           {category} Tips
//         </h2>
//         <ul className="list-disc pl-5 text-gray-600">
//           {tipsData[category].map((tip, index) => (
//             <li key={index}>{tip}</li>
//           ))}
//         </ul>
//       </div>

//       {/* Generator */}
//       <div className="bg-white p-6 rounded-xl shadow">
//         <h2 className="text-xl font-bold text-pink-600 mb-4">
//           Smart Tip Generator
//         </h2>

//         <div className="flex gap-4 mb-4">
//           <select id="location" className="p-2 border rounded">
//             <option value="street">Street</option>
//             <option value="bus">Bus</option>
//             <option value="office">Office</option>
//           </select>

//           <select id="time" className="p-2 border rounded">
//             <option value="day">Day</option>
//             <option value="night">Night</option>
//           </select>

//           <button
//             onClick={generateTip}
//             className="bg-pink-500 text-white px-4 py-2 rounded"
//           >
//             Generate
//           </button>
//         </div>

//         <div className="bg-gray-100 p-4 rounded">
//           {generatedTip || "Your safety tip will appear here"}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default SafetyTips;