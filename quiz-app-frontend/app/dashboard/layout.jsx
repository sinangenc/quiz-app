'use client'
import PrivateRoute from "@/app/_components/PrivateRoute/PrivateRoute"
import DashboardSidebar from "@/app/_components/DashboardSidebar/DashboardSidebar"

export default function DashboardLayout({children}){
    return (
        <PrivateRoute>
            <section>
                <div className="container flex flex-col py-6 mx-auto">
                    <div className="flex min-h-screen">
                        
                        <DashboardSidebar />
                        
                        <main className="flex-1 px-6">
                            {children}
                        </main>
                    </div>
                </div>
            </section>
        </PrivateRoute>
    );
}