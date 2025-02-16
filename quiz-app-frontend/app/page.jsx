import Link from "next/link";

export default function Home() {
  return (
    <section className="bg-white dark:bg-gray-900">
      <div className="container flex flex-col items-center px-4 py-12 mx-auto text-center">
        <h2 className="text-2xl font-bold tracking-tight text-gray-800 xl:text-3xl dark:text-white">
        Prepare for the German Citizenship Exam
        </h2>

        <div className="block max-w-4xl mt-4 text-gray-600 dark:text-gray-300 space-y-4">
          <span className="text-lg font-medium text-gray-800 dark:text-white">
            This app offers two modes to help you prepare for the German citizenship exam:
          </span>

          <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg shadow-md">
            <p className="text-sm text-gray-800 dark:text-white">
              <strong className="text-blue-600 dark:text-blue-400">Test Mode</strong>: 
              Simulate the real exam with 33 questions and view your results after completion.
            </p>
          </div>

          <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg shadow-md">
            <p className="text-sm text-gray-800 dark:text-white">
              <strong className="text-blue-600 dark:text-blue-400">Practice Mode</strong>: 
              Answer questions one by one and learn the correct answer after each response.
            </p>
          </div>
        </div>


        <div className="mt-6">
          <Link href="/test"
            className="inline-flex items-center justify-center w-full px-4 py-2.5 mt-4 overflow-hidden text-sm text-white transition-colors duration-300 bg-blue-600 rounded-lg shadow sm:w-auto sm:mx-2 sm:mt-0 hover:bg-blue-500 focus:ring focus:ring-blue-300 focus:ring-opacity-80">
            <span className="mx-2">
              Start Test Mode
            </span>
          </Link>
          <Link href="/practice" className="inline-flex items-center justify-center w-full px-4 py-2.5 overflow-hidden text-sm text-white transition-colors duration-300 bg-gray-900 rounded-lg shadow sm:w-auto sm:mx-2 hover:bg-gray-700 dark:bg-gray-800 dark:hover:bg-gray-700 focus:ring focus:ring-gray-300 focus:ring-opacity-80">
            <span className="mx-2">
              Start Practice Mode
            </span>
          </Link>
        </div>
      
      </div>
    </section>

  );
}
