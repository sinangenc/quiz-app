import "@/app/globals.css";

import Navbar from "@/app/_components/Navbar/Navbar";
import AuthProvider from "@/app/_context/AuthContext";

export const metadata = {
  title: {
    default: 'Quiz App',
    template: '%s | Quiz App',
  },
  description: 'Prepare for the German Citizenship Exam',
};

export default function RootLayout({ children }) {

  return (
    <html lang="en">
      <body
        className="">
        <AuthProvider>
            <Navbar/>
            {children}
        </AuthProvider>
      </body>
    </html>
  );
}
