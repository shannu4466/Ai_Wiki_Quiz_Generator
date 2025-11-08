import { useState, useEffect } from "react";
import { generateQuiz } from "../services/api";
import QuizDisplay from "../components/QuizDisplay";
import { FaBrain } from "react-icons/fa";
import { RiAiGenerate2 } from "react-icons/ri";
import { MdCheckCircle } from "react-icons/md";

const GenerateQuizTab = ({ setGlobalLoading }) => {
    const [url, setUrl] = useState("");
    const [quiz, setQuiz] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {
        if (setGlobalLoading) setGlobalLoading(loading);
    }, [loading, setGlobalLoading]);

    const handleGenerate = async () => {
        if (!url.startsWith('https://en.wikipedia.org/wiki/')) {
            setError("Enter valid Wikipedia URL. Don't paste other than wikipedia URL's");
            return;
        }
        if (!url.trim()) {
            setError("Please enter a valid Wikipedia URL ✨");
            return;
        }
        setError("");
        setLoading(true);
        setQuiz(null);
        try {
            const result = await generateQuiz(url);
            setQuiz(result);
            setUrl("");
        } catch (err) {
            const errorMessage =
                err.message || "⚠️ Failed to generate quiz. Try a different URL.";
            setError(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen w-full bg-linear-to-br from-indigo-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-950 dark:to-black transition-all duration-500 overflow-x-hidden">
            <div className="w-full px-6 sm:px-12 md:px-20 py-8 text-center 
                            bg-white/10 dark:bg-gray-800/20 
                            backdrop-filter backdrop-blur-xl 
                            border-b border-gray-300/30 dark:border-gray-700/50 
                            shadow-2xl hover:shadow-indigo-500/20 transition-all duration-500">

                <h1 className="text-4xl md:text-5xl font-black 
                               bg-linear-to-r from-green-500 via-indigo-300 to-red-400 
                               bg-clip-text text-transparent drop-shadow-2xl 
                               animate-pulse-slow">
                    <FaBrain className="inline-block align-middle mr-4 text-indigo-500 text-6xl md:text-7xl 
                                transform hover:scale-105 transition-transform duration-300" />
                    AI Wiki Quiz Generator
                </h1>
                <p className="text-gray-600 dark:text-gray-400 text-xs md:text-sm mt-1 mb-2 
                            font-normal tracking-tight max-w-3xl mx-auto opacity-80">
                    Paste a
                    <span className="font-medium opacity-100"> Wikipedia URL </span>
                    and
                    <span className="font-medium opacity-100"> AI Wiki </span>
                    will generate
                    <span className="font-medium opacity-100"> questions </span>
                    for you.
                </p>
            </div>

            <div className="max-w-4xl mx-auto px-4 sm:px-6">
                <div className="w-full bg-white/70 dark:bg-gray-800/80 backdrop-blur-md p-6 sm:p-8 rounded-3xl 
                                shadow-xl dark:shadow-2xl border border-gray-200/50 dark:border-gray-700/50 my-8">
                    <div className="flex flex-col gap-4 items-center w-full">
                        <div className="relative w-full">
                            <input
                                type="text"
                                placeholder="🔗 Paste Wikipedia URL..."
                                value={url}
                                onChange={(e) => setUrl(e.target.value)}
                                disabled={loading}
                                className="w-full p-4 pr-16 rounded-xl border-2 border-gray-300 dark:border-gray-600 
                                text-gray-800 dark:text-gray-100 bg-white/95 dark:bg-gray-900/50 
                                placeholder-gray-500 dark:placeholder-gray-400 
                                focus:outline-none focus:ring-4 focus:ring-blue-500/50 transition-all duration-300 text-lg 
                                disabled:opacity-60 disabled:cursor-not-allowed"
                            />

                            <button
                                onClick={handleGenerate}
                                disabled={loading}
                                className={`absolute inset-y-2 right-3 flex items-center justify-center 
                                w-10 h-10 rounded-full transition-all duration-300 transform shadow-md 
                                ${loading
                                        ? "bg-gray-400 dark:bg-gray-600 text-gray-200 cursor-not-allowed"
                                        : "bg-blue-600 hover:bg-blue-700 text-white hover:scale-105 active:scale-95 shadow-blue-500/50"
                                    }`}
                                aria-label={loading ? "Generating Quiz" : "Generate Quiz"}
                            >
                                {loading ? (
                                    <svg className="animate-spin h-5 w-5 text-white" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                ) : (
                                    <RiAiGenerate2 className="h-5 w-5" />
                                )}
                            </button>
                        </div>

                        {error && (
                            <p className="mt-4 text-red-600 dark:text-red-400 bg-red-100 dark:bg-red-900/30 p-4 rounded-xl border border-red-300 dark:border-red-700 text-center font-medium shadow-inner">
                                ⚠️ **Error:** {error}
                            </p>
                        )}
                    </div>
                </div>

                {loading && !quiz && (
                    <div className="w-full text-center bg-white dark:bg-gray-800 p-12 rounded-3xl shadow-xl border border-indigo-300 dark:border-indigo-700 animate-pulse mb-8">
                        <svg className="animate-bounce h-10 w-10 text-indigo-600 dark:text-indigo-400 mx-auto mb-4" viewBox="0 0 24 24" stroke="currentColor" fill="none">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.002 2.002m0 0l2.004-2.004m-2.004 2.004v10.003" />
                        </svg>
                        <p className="text-xl text-gray-700 dark:text-gray-300 font-semibold">
                            Scanning Wikipedia article... generating questions ✨
                        </p>
                    </div>
                )}

                {quiz && (
                    <div className="w-full bg-white dark:bg-gray-800 p-8 rounded-3xl shadow-2xl border border-gray-200 dark:border-gray-700 mb-8">
                        <h2 className="text-3xl font-bold mb-6 text-gray-900 dark:text-white border-b-2 border-indigo-500/50 pb-3 flex items-center">
                            <span className="text-indigo-500 text-4xl mr-3"><MdCheckCircle /></span> Quiz Results Ready
                        </h2>
                        <div className="w-full max-h-[80vh] overflow-y-auto pr-4 custom-scrollbar">
                            <QuizDisplay quiz={quiz} />
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default GenerateQuizTab;