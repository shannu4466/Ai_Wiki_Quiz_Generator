import { FaBrain, FaThumbtack, FaMagic, FaCheck } from "react-icons/fa";

const QuizDisplay = ({ quiz }) => {
    if (!quiz) return null;

    const {
        title,
        summary,
        key_entities,
        sections,
        quiz: questions,
    } = quiz;

    return (
        <div className="text-gray-900 dark:text-gray-100 transition-colors duration-300">
            {/* Title and Summary */}
            <header className="pb-4 border-b border-gray-200 dark:border-gray-700 mb-6">
                {title && (
                    <h2 className="text-3xl font-extrabold mb-2 text-pink-700 dark:text-blue-400 leading-tight flex items-center">
                        <FaBrain className="mr-2" /> {title}
                    </h2>
                )}
                {summary && (
                    <p className="text-gray-600 dark:text-gray-400 italic">{summary}</p>
                )}
            </header>

            {/* Key Entities Section */}
            {key_entities && (
                <div className="mb-8 space-y-3">
                    <h3 className="text-xl font-semibold text-indigo-600 dark:text-blue-400 flex items-center">
                        <FaThumbtack className="mr-2" /> Key Entities
                    </h3>
                    <div className="grid sm:grid-cols-3 gap-4 text-sm">
                        {["people", "organizations", "locations"].map((cat) => (
                            <div
                                key={cat}
                                className="p-4 rounded-lg bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700"
                            >
                                <h4 className="font-bold capitalize mb-2 text-gray-700 dark:text-gray-300">
                                    {cat}
                                </h4>
                                {key_entities[cat]?.length ? (
                                    <ul className="list-disc list-inside space-y-1 text-gray-600 dark:text-gray-400">
                                        {key_entities[cat].map((item, i) => (
                                            <li key={i}>{item}</li>
                                        ))}
                                    </ul>
                                ) : (
                                    <p className="italic text-gray-500">None found</p>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Main Section */}
            {sections && sections.length > 0 && (
                <div className="mb-8">
                    <h3 className="text-xl font-semibold text-indigo-600 dark:text-blue-400 mb-2 flex items-center">
                        <FaMagic className="mr-2" /> Main Sections
                    </h3>
                    <div className="flex flex-wrap gap-2">
                        {sections.map((sec, idx) => (
                            <span
                                key={idx}
                                className="px-3 py-1 bg-indigo-100 dark:bg-yellow-900 text-indigo-800 dark:text-indigo-200 rounded-full text-sm font-medium"
                            >
                                {sec}
                            </span>
                        ))}
                    </div>
                </div>
            )}

            {/* Quiz Questions */}
            {questions && questions.length > 0 ? (
                <div className="space-y-6">
                    {questions.map((q, index) => (
                        <div
                            key={index}
                            className="p-6 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-md hover:shadow-lg transition-shadow duration-300"
                        >
                            <h3 className="text-lg font-bold mb-3 text-gray-800 dark:text-gray-200">
                                <span className="text-indigo-600 dark:text-indigo-400 mr-2">
                                    Q{index + 1}.
                                </span>
                                {q.question}
                            </h3>

                            <div className="space-y-2 mb-4">
                                {q.options?.map((opt, i) => (
                                    <div
                                        key={i}
                                        className="p-3 pl-4 rounded-lg bg-gray-50 dark:bg-gray-700/50 text-gray-700 dark:text-gray-300 flex items-start"
                                    >
                                        <span className="font-mono font-semibold text-sm mr-2 text-indigo-500 dark:text-indigo-300">
                                            {String.fromCharCode(65 + i)}.
                                        </span>
                                        <span className="flex-grow">{opt}</span>
                                    </div>
                                ))}
                            </div>

                            <div className="pt-3 mt-3 border-t border-dashed border-gray-300 dark:border-gray-600">
                                <p className="text-green-700 dark:text-green-400 font-semibold flex items-center">
                                    <FaCheck className="mr-2" /> Answer: <span className="ml-2">{q.answer}</span>
                                </p>
                                {q.explanation && (
                                    <p className="text-gray-600 dark:text-gray-400 text-sm mt-1">
                                        💡 {q.explanation}
                                    </p>
                                )}
                                {q.difficulty && (
                                    <p className="text-xs mt-2 text-gray-500 uppercase">
                                        Difficulty Level: {q.difficulty}
                                    </p>
                                )}
                                {q.related_topics?.length > 0 && (
                                    <div className="mt-2 text-sm text-indigo-600 dark:text-indigo-300">
                                        🔗 Related: {q.related_topics.join(", ")}
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="p-8 text-center border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-xl bg-gray-50 dark:bg-gray-800/50">
                    <p className="text-xl text-gray-500 dark:text-gray-400">
                        🤷‍♂️ The AI did not generate any questions from the article. Try a
                        different URL!
                    </p>
                </div>
            )}
        </div>
    );
};

export default QuizDisplay;
