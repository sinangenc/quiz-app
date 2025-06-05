'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import RoleControl from '@/app/_components/RoleControl/RoleControl';

export default function DashboardSidebar(){
    const pathname = usePathname();

  const linkClass = (path) =>
    `block px-4 py-3 rounded-md ${
      pathname === path ? 'text-white bg-primary shadow-lg' : 'text-gray-700 hover:text-primary'
    }`;

    return (
        <aside className="w-64 bg-white rounded-lg shadow-md p-4">
            <nav className="space-y-6">
                {/* User Settings Group */}
                <div>
                    <h5 className="text-link dark:text-white/70 caption font-semibold leading-6 tracking-widest text-xs pb-2 uppercase">
                        User Settings
                    </h5>
                    <Link href="/dashboard" className={linkClass('/dashboard')}>
                        Dashboard
                    </Link>
                    <Link href="/dashboard/update-profile" className={linkClass('/dashboard/update-profile')}>
                        Update Profile
                    </Link>
                    <Link href="/dashboard/change-password" className={linkClass('/dashboard/change-password')}>
                        Change Password
                    </Link>
                </div>

                <RoleControl allowedRoles={["ADMIN"]}>
                   <hr className="border-gray-300" />
                    {/* Admin Group */}
                    <div>
                        <h5 className="text-link dark:text-white/70 caption font-semibold leading-6 tracking-widest text-xs pb-2 uppercase">
                            Admin Operations
                        </h5>
                        <Link href="/dashboard/admin/questions" className={linkClass('/dashboard/admin/questions')}>
                            Questions
                        </Link>
                        <Link href="/dashboard/admin/users" className={linkClass('/dashboard/admin/users')}>
                            Users
                        </Link>
                    </div>
                </RoleControl>

                
                <hr className="border-gray-300" />
                
                {/* Quiz Group */}
                <div>
                    <h5 className="text-link dark:text-white/70 caption font-semibold leading-6 tracking-widest text-xs pb-2 uppercase">
                        Quiz
                    </h5>
                    <Link href="/test" className={linkClass('/test')}>
                        Test Mode
                    </Link>
                    <Link href="/practice" className={linkClass('/practice')}>
                        Practice Mode
                    </Link>
                </div>

            </nav>
        </aside>
    )
}