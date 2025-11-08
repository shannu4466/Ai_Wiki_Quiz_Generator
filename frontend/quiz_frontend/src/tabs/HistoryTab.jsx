import React, { useEffect, useState } from "react";
import { fetchHistory, fetchQuizById } from "../services/api";
import QuizDisplay from "../components/QuizDisplay";
import { FaHistory } from "react-icons/fa";
import { TbMoodEmpty } from "react-icons/tb";

const HistoryTab = () => {
    const [history, setHistory] = useState([]);
    const [selectedQuiz, setSelectedQuiz] = useState(null);
    const [loading, setLoading] = useState(false);
    const [historyLoading, setHistoryLoading] = useState(true);

    useEffect(() => {
        loadHistory();
    }, []);

    const loadHistory = async () => {
        setHistoryLoading(true);
        try {
            const data = await fetchHistory();
            setHistory(data);
        } catch (error) {
            console.error("Error fetching history:", error);
        } finally {
            setHistoryLoading(false);
        }
    };
    
    console.log(history)

    const viewQuiz = async (id) => {
        setLoading(true);
        setSelectedQuiz(null);
        try {
            const quiz = await fetchQuizById(id);
            setSelectedQuiz(quiz);
        } catch (error) {
            console.error("Error fetching quiz:", error);
        } finally {
            setLoading(false);
        }
    };

    const formatDate = (dateString) => {
        if (!dateString) return "N/A";
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    return (
        <div className="flex justify-center p-8 min-h-screen bg-gray-100 dark:bg-gray-900 transition-colors duration-300">
            <div className="max-w-6xl w-full">

                {/* Header Section */}
                <header className="mb-8 p-4 bg-white dark:bg-gray-800 shadow-xl rounded-xl">
                    <h1 className="text-4xl font-extrabold text-indigo-700 dark:text-blue-400 flex items-center">
                        <FaHistory className="mr-2" /> Quiz Generation History
                    </h1>
                    <p className="text-gray-600 dark:text-gray-400 mt-2">
                        Review and reload previously generated quizzes from your Wikipedia history.
                    </p>
                </header>

                {/* Loading State for History */}
                {historyLoading ? (
                    <div className="text-center p-12 text-lg text-indigo-700 dark:text-indigo-400 bg-white dark:bg-gray-800 rounded-xl shadow-lg">
                        <svg className="animate-spin h-6 w-6 text-indigo-500 mx-auto mb-3" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Loading quiz history...
                    </div>
                ) : history.length === 0 ? (
                    <div className="p-12 text-center border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-xl bg-gray-50 dark:bg-gray-800/50">
                        <p className="text-xl text-gray-500 dark:text-gray-400 flex items-center">
                            <TbMoodEmpty className="mr-2" /> Your history is empty! Generate a quiz to start logging.
                        </p>
                    </div>
                ) : (
                    <>
                        {/* Desktop Table View */}
                        <div className="hidden md:block overflow-x-auto bg-white dark:bg-gray-800 rounded-xl shadow-lg">
                            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                                <thead className="bg-indigo-50 dark:bg-gray-700/50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider rounded-tl-xl">SERIAL NO</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Title</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Source URL</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Generated Date</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider rounded-tr-xl">Action</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200 dark:divide-gray-700 text-gray-800 dark:text-gray-200">
                                    {history.map((item) => (
                                        <tr key={item.id} className="hover:bg-gray-50 dark:hover:bg-gray-700 transition duration-150">
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">{item.serial_no}</td>
                                            <td className="px-6 py-4 text-sm font-medium">{item.title}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm">
                                                <a
                                                    href={item.url}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="text-blue-700! dark:text-blue-400! hover:text-blue-500! underline font-medium transition-colors duration-150"
                                                >
                                                    View Source
                                                </a>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm">{formatDate(item.date_generated)}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm">
                                                <button
                                                    onClick={() => viewQuiz(item.id)}
                                                    className="bg-blue-500 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-indigo-700 transition duration-150 shadow-md disabled:bg-gray-400"
                                                    disabled={loading}
                                                >
                                                    {loading && selectedQuiz?.id === item.id ? 'Loading...' : 'View Quiz'}
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {/* Mobile View*/}
                        <div className="md:hidden space-y-4">
                            {history.map((item) => (
                                <div key={item.id} className="p-4 bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700">
                                    <div className="flex justify-between items-start mb-2">
                                        <h3 className="text-lg font-bold text-indigo-600 dark:text-indigo-400">{item.title}</h3>
                                        <span className="text-xs font-mono text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">SERIAL NO: {item.serial_no}</span>
                                    </div>
                                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                                        Date: {formatDate(item.date_generated)}
                                    </p>
                                    <div className="flex justify-between items-center pt-2 border-t border-gray-100 dark:border-gray-700">
                                        <a
                                            href={item.url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-blue-700! dark:text-blue-400! hover:text-blue-500! underline"
                                        >
                                            Source Link
                                        </a>
                                        <button
                                            onClick={() => viewQuiz(item.id)}
                                            className="bg-blue-500 text-white px-3 py-1 rounded-lg text-sm font-semibold hover:bg-indigo-700 transition duration-150 disabled:bg-gray-400"
                                            disabled={loading}
                                        >
                                            {loading && selectedQuiz?.id === item.id ? 'Loading...' : 'View Quiz'}
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </>
                )}

                {/* Display Selected Quiz */}
                {loading && <p className="mt-6 text-center text-indigo-600 dark:text-indigo-400">Loading quiz details...</p>}

                {selectedQuiz && (
                    <div className="mt-8 p-6 bg-white dark:bg-gray-800 rounded-xl shadow-2xl">
                        <div className="flex justify-between items-center mb-4 border-b pb-3 border-indigo-200 dark:border-indigo-800">
                            <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100">
                                Detailed Quiz View
                            </h2>
                            <button
                                onClick={() => setSelectedQuiz(null)}
                                className="text-gray-500 dark:text-gray-400 hover:text-red-600 transition-colors"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>
                        <div className="max-h-[70vh] overflow-y-auto pr-2">
                            <QuizDisplay quiz={selectedQuiz} />
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default HistoryTab;