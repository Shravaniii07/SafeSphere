import React from "react";

const Laws = () => {
  const laws = [
    {
      title: "IPC Section 354",
      desc: "Protects women against assault or criminal force intended to outrage modesty, including unwanted physical contact or harassment.",
    },
    {
      title: "IPC Section 498A",
      desc: "Protects married women from cruelty by husband or in-laws, including mental and physical abuse.",
    },
    {
      title: "Domestic Violence Act, 2005",
      desc: "Provides protection from physical, emotional, sexual, and economic abuse within households.",
    },
    {
      title: "Workplace Harassment Act, 2013",
      desc: "Ensures safe workplaces and mandates complaint committees to address harassment cases.",
    },
  ];

  const rights = [
    "Right to equality",
    "Right to dignity",
    "Right against harassment",
    "Right to legal protection",
    "Right to workplace safety",
  ];

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-8">

      {/* 🔥 HERO */}
      <div className="text-center mb-10">
        <h1 className="text-3xl md:text-4xl font-bold text-slate-800">
          Women Laws & Rights in India
        </h1>
        <p className="text-slate-500 mt-2">
          Legal awareness is the first step towards safety and justice
        </p>
      </div>

      {/* 🔥 INTRO */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 mb-8 max-w-4xl mx-auto">
        <h2 className="text-xl font-semibold text-slate-800 mb-3">
          Legal Awareness
        </h2>
        <p className="text-slate-500">
          Understanding your legal rights is essential for every woman's safety
          and empowerment. It helps prevent exploitation, builds confidence,
          and ensures women know how to seek justice when needed.
        </p>
      </div>

      {/* 🔥 LAWS */}
      <div className="max-w-5xl mx-auto">
        <h2 className="text-2xl font-bold text-slate-800 mb-6">
          Important Indian Laws
        </h2>

        <div className="grid md:grid-cols-2 gap-6">
          {laws.map((law, index) => (
            <div
              key={index}
              className="bg-white p-6 rounded-2xl shadow-sm hover:shadow-md transition border border-slate-100"
            >
              <h3 className="text-lg font-semibold text-blue-600">
                {law.title}
              </h3>
              <p className="text-slate-500 mt-2 text-sm">
                {law.desc}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* 🔥 RIGHTS */}
      <div className="mt-12 bg-white p-6 rounded-2xl shadow-sm border border-slate-100 max-w-4xl mx-auto">
        <h2 className="text-xl font-semibold text-slate-800 mb-4">
          Rights of Women
        </h2>

        <ul className="list-disc pl-6 text-slate-500 space-y-2">
          {rights.map((item, index) => (
            <li key={index}>{item}</li>
          ))}
        </ul>
      </div>

      {/* 🔥 CONCLUSION */}
      <div className="mt-8 bg-white p-6 rounded-2xl shadow-sm border border-slate-100 max-w-4xl mx-auto">
        <p className="text-slate-500 text-center">
          Knowing your rights is the foundation of empowerment and safety.
          Stay informed, stay aware, and never hesitate to seek help.
        </p>
      </div>

      {/* 🚨 FOOTER NOTE */}
      <div className="mt-8 bg-red-100 text-red-600 p-4 rounded-xl text-center max-w-4xl mx-auto">
        Emergency Helpline (India): Police 112 | Women Helpline 181 / 1091
      </div>

    </div>
  );
};

export default Laws;