import React, { useEffect, useState } from "react";

const SheSafe = ({ onNavigate }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const username = localStorage.getItem("username") || "User";

  useEffect(() => {
    const loginStatus = sessionStorage.getItem("isLoggedIn");
    setIsLoggedIn(loginStatus === "true");
  }, []);

  return (
    <div className="bg-gray-100 min-h-screen">

      {/* HEADER */}
      <header className="bg-white px-8 py-4 flex justify-between items-center shadow-sm">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">SheSafe</h1>
          <p className="text-sm text-gray-500">Your Safety, Your Strength</p>
        </div>

        <div className="flex gap-6 text-gray-600 font-medium">
          <button onClick={() => onNavigate("shesafe")}>Home</button>
          <button onClick={() => onNavigate("emergency")}>Emergency</button>
          <button onClick={()=> onNavigate("selfDefense")}>Self-Defense</button>
          <button on onClick={()=> onNavigate("safetyTips")}>Safety Tips</button>
          
        </div>
      </header>

      {/* HERO */}
      <section className="bg-gradient-to-r from-pink-200 via-purple-200 to-blue-200 py-16 px-6 flex justify-center">
        <div className="bg-white rounded-2xl p-10 max-w-4xl shadow">
          <h1 className="text-4xl font-bold text-gray-800">
            Safety is a Right, Not a Privilege
          </h1>
          <p className="text-gray-600 mt-4">
            SheSafe is your trusted space to learn self-defense, access emergency support,
            and stay informed on safety and legal rights. Every woman deserves confidence,
            security, and immediate help when needed.
          </p>

          <div className="mt-6 flex gap-4">
            <button
              onClick={() => onNavigate("emergency")}
              className="bg-gray-900 text-white px-6 py-2 rounded-lg"
            >
              Get Help Now
            </button>

            <button className="border px-6 py-2 rounded-lg text-gray-700" 
            onClick={()=> onNavigate("selfDefense")}>
              Learn Self-Defense
            </button>
          </div>
        </div>
      </section>

      {/* ABOUT */}
      <section className="p-10 flex justify-center">
        <div className="bg-white p-8 rounded-2xl shadow max-w-4xl w-full">
          <h2 className="text-2xl font-bold text-gray-800">About SheSafe</h2>
          <p className="text-gray-600 mt-3">
            SheSafe is an awareness platform designed to educate, empower, and protect women through safety tips, self-defense knowledge, emergency support, and legal awareness.
          </p>
        </div>
      </section>

      {/* IMPORTANCE */}
      <section className="p-10 flex justify-center">
        <div className="bg-white p-8 rounded-2xl shadow max-w-4xl w-full">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            Why Women Safety is Important
          </h2>
          <ul className="space-y-3 text-gray-600">
            <li>🛡️ Protects women from violence and harassment</li>
            <li>💪 Encourages confidence and independence</li>
            <li>📚 Spreads legal and self-defense awareness</li>
            <li>🤝 Promotes safer communities</li>
            <li>⚡ Supports quick emergency response</li>
          </ul>
        </div>
      </section>

      {/* SELF DEFENSE */}
      <section className="p-10 flex justify-center">
        <div className="bg-white p-8 rounded-2xl shadow max-w-4xl w-full">
          <h2 className="text-2xl font-bold text-gray-800">
            Self-Defense Awareness
          </h2>
          <ul className="mt-4 space-y-3 text-gray-600">
            <li>🥋 Learn simple moves to escape danger</li>
            <li>👀 Stay alert in public places</li>
            <li>📱 Keep emergency contacts ready</li>
          </ul>
        </div>
      </section>

      {/* FACTS */}
      <section className="p-10 flex justify-center">
        <div className="bg-white p-8 rounded-2xl shadow max-w-4xl w-full">
          <h2 className="text-2xl font-bold text-gray-800">
            Did You Know? Quick Safety Facts
          </h2>
          <ul className="mt-4 space-y-3 text-gray-600">
            <li>🔔 Share live location in emergencies</li>
            <li>🚕 Verify cab details before travel</li>
            <li>🏠 Plan safe routes at night</li>
          </ul>
        </div>
      </section>

      {/* LAWS */}
      <section className="p-10 flex justify-center">
        <div className="bg-white p-8 rounded-2xl shadow max-w-4xl w-full">
          <h2 className="text-2xl font-bold text-gray-800">
            Laws & Rights Awareness
          </h2>

          <div className="mt-4 space-y-3">
            <div className="bg-pink-50 border-l-4 border-pink-400 p-3 rounded">
              ⚖️ Know your rights against harassment
            </div>
            <div className="bg-pink-50 border-l-4 border-pink-400 p-3 rounded">
              📞 Contact police or helplines
            </div>
            <div className="bg-pink-50 border-l-4 border-pink-400 p-3 rounded">
              🧾 Workplace safety laws
            </div>
          </div>

          <button className="mt-5 bg-gray-900 text-white px-5 py-2 rounded-lg" onClick={()=>onNavigate("laws")}>
            View Women Laws
          </button>
        </div>
      </section>

      {/* EMERGENCY */}
      <section className="p-10 flex justify-center">
        <div className="bg-blue-900 text-white p-8 rounded-2xl max-w-4xl w-full">
          <h3 className="text-xl font-bold">
            Emergency Numbers (India)
          </h3>
          <p className="text-gray-300 mt-2">
            In any unsafe situation, call immediately.
          </p>

          <div className="flex gap-6 mt-6">
            <div className="bg-blue-800 p-4 rounded-lg flex justify-between w-full">
              <div>
                <p className="font-bold">Police</p>
                <p>112</p>
              </div>
              <button className="bg-pink-200 text-black px-4 py-1 rounded">
                Call Now
              </button>
            </div>

            <div className="bg-blue-800 p-4 rounded-lg flex justify-between w-full">
              <div>
                <p className="font-bold">Women Helpline</p>
                <p>181 / 1091</p>
              </div>
              <button className="bg-pink-200 text-black px-4 py-1 rounded">
                Call Now
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* QUOTES */}
      <section className="p-10 flex justify-center">
        <div className="border border-pink-200 p-6 rounded-2xl max-w-4xl w-full text-gray-600">
          <p>“A woman who knows her strength is unstoppable.”</p>
          <p className="mt-3">
            “Empowerment begins with awareness and courage.”
          </p>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-blue-950 text-white text-center p-6">
        <p>© 2026 SheSafe. All Rights Reserved.</p>
        <p className="mt-1">
          Emergency Helpline: Police 112 | Women 181 / 1091
        </p>
      </footer>
    </div>
  );
};

export default SheSafe;


// import React from "react";

// const SheSafe = ({ onNavigate }) => {
//   return (
//     <div className="p-6 space-y-8">

//       {/* Header */}
//       <div className="bg-pink-500 text-white rounded-2xl p-6 shadow-md flex justify-between items-center">
//         <h1 className="text-2xl font-bold">SheSafe</h1>
//         <button
//           onClick={() => onNavigate("dashboard")}
//           className="bg-white text-pink-500 px-4 py-2 rounded-xl font-semibold hover:bg-gray-100"
//         >
//           Back
//         </button>
//       </div>

//       {/* Hero Section */}
//       <div className="bg-gradient-to-r from-pink-100 to-pink-200 p-10 rounded-2xl text-center shadow">
//         <h2 className="text-3xl font-bold text-pink-700 mb-2">
//           Women Safety & Protection
//         </h2>
//         <p className="text-gray-600">
//           Your safety matters. Access emergency help, tips, and support instantly.
//         </p>
//       </div>

//       {/* Features */}
//       <div>
//         <h2 className="text-xl font-semibold text-pink-600 mb-4">
//           Safety Features
//         </h2>

//         <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          
//           <div className="bg-white p-5 rounded-2xl shadow hover:shadow-lg transition">
//             <h3 className="font-semibold text-lg">📍 Live Tracking</h3>
//             <p className="text-sm text-gray-500 mt-2">
//               Share your real-time location with trusted contacts.
//             </p>
//           </div>

//           <div className="bg-white p-5 rounded-2xl shadow hover:shadow-lg transition">
//             <h3 className="font-semibold text-lg">🚨 SOS Alert</h3>
//             <p className="text-sm text-gray-500 mt-2">
//               Send emergency alerts instantly with one click.
//             </p>
//           </div>

//           <div className="bg-white p-5 rounded-2xl shadow hover:shadow-lg transition">
//             <h3 className="font-semibold text-lg">📞 Emergency Contacts</h3>
//             <p className="text-sm text-gray-500 mt-2">
//               Quickly reach police, ambulance, or guardians.
//             </p>
//           </div>

//         </div>
//       </div>

//       {/* SOS Section */}
//       <div className="bg-white p-6 rounded-2xl shadow text-center">
//         <h2 className="text-xl font-semibold text-red-500 mb-3">
//           Emergency SOS
//         </h2>
//         <p className="text-gray-500 mb-4">
//           Press the button below in case of danger.
//         </p>

//         <button
//           onClick={() => alert("SOS Triggered!")}
//           className="bg-red-500 text-white px-6 py-3 rounded-xl font-bold text-lg hover:bg-red-600"
//         >
//           🚨 Trigger SOS
//         </button>
//       </div>

//       {/* Footer */}
//       <div className="text-center text-gray-400 text-sm">
//         © 2026 SheSafe | Stay Safe ❤️
//       </div>

//     </div>
//   );
// };

// export default SheSafe;
