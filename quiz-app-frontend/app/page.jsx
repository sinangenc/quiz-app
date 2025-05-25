import Link from "next/link";

export default function Home() {
  return (
    <section>
      <div className="flex flex-col items-center text-center space-y-4">
        <h2 className="text-3xl font-semibold text-gray-800">
          Prepare for the German Citizenship Exam
        </h2>

        <span className="text-lg font-medium text-gray-800">
          This app offers two modes to help you prepare for the German citizenship exam:
        </span>
      </div>


      <div className="flex flex-wrap justify-center gap-4 mt-10">
        <div className="max-w-sm p-6 bg-white border border-gray-200 rounded-lg shadow-sm">
            <h3 className="mb-3 text-xl text-gray-800">Test Mode</h3>
            <p className="mb-3 font-normal text-gray-700">Simulate the real exam with 33 questions and view your results after completion.</p>
            <Link href="/test" className="inline-flex items-center px-3 py-2 text-sm font-medium text-center text-white transition-colors duration-300 bg-blue-600 rounded-lg hover:bg-blue-500">
                Start Test Mode
            </Link>
        </div>

        <div className="max-w-sm p-6 bg-white border border-gray-200 rounded-lg shadow-sm">
            <h5 className="mb-3 text-xl text-gray-800">Practice Mode</h5>
            <p className="mb-3 font-normal text-gray-700 dark:text-gray-400">Answer questions one by one and learn the correct answer after each response.</p>
            <Link href="/practice" className="inline-flex items-center px-3 py-2 text-sm font-medium text-center text-white transition-colors duration-300 bg-blue-600 rounded-lg hover:bg-blue-500">
                Start Practice Mode
            </Link>
        </div>
      </div>
    </section>
  );
}
