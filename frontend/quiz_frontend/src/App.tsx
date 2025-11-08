import { useState } from "react";
import GenerateQuizTab from "./tabs/GenerateQuizTab";
import HistoryTab from "./tabs/HistoryTab";
import { FaBrain, FaHistory } from "react-icons/fa";

export default function App() {
  const [tab, setTab] = useState("generate");

  return (
    <div className="min-h-screen w-full flex flex-col bg-linear-to-br from-indigo-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-950 dark:to-black transition-all duration-500 overflow-x-hidden">
      <nav className="sticky top-0 z-50 w-full backdrop-blur-md bg-white/70 dark:bg-gray-900/60 border-b border-gray-200 dark:border-gray-700 shadow-sm">
        <div className="flex justify-center gap-4 sm:gap-6 py-4">
          <button
            onClick={() => setTab("generate")}
            className={`px-6 py-2.5 rounded-xl font-semibold transition-all duration-300 ${tab === "generate"
              ? "bg-linear-to-r from-indigo-600 to-blue-500 text-white shadow-lg scale-105 flex items-center"
              : "bg-gray-200/70 dark:bg-gray-800/70 text-gray-800 dark:text-gray-200 hover:bg-gray-300/60 dark:hover:bg-gray-700/60 flex items-center"
              }`}
          >
            <FaBrain className="mr-2" /> Generate Quiz
          </button>
          <button
            onClick={() => setTab("history")}
            className={`px-6 py-2.5 rounded-xl font-semibold transition-all duration-300 ${tab === "history"
              ? "bg-linear-to-r from-indigo-600 to-blue-500 text-white shadow-lg scale-105 flex items-center"
              : "bg-gray-200/70 dark:bg-gray-800/70 text-gray-800 dark:text-gray-200 hover:bg-gray-300/60 dark:hover:bg-gray-700/60 flex items-center"
              }`}
          >
            <FaHistory className="mr-2" /> History
          </button>
        </div>
      </nav>

      <div className="grow w-full">
        {tab === "generate" ? <GenerateQuizTab setGlobalLoading={undefined} /> : <HistoryTab />}
      </div>
    </div>
  );
}
