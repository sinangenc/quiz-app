import "./globals.css";

import Navbar from "./_components/Navbar/Navbar";
import AuthProvider from "./_context/AuthContext";



export const metadata = {
  title: "Quiz App",
  description: "Prepare for the German Citizenship Exam",
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
