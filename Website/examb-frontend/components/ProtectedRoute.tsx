'use client';
import { ReactNode, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getUserRole } from '@/lib/auth';

interface ProtectedRouteProps {
  children: ReactNode;
  allowedRole: 'student' | 'admin';
}

export default function ProtectedRoute({ children, allowedRole }: ProtectedRouteProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(true); // wait until we check role
  const [roleChecked, setRoleChecked] = useState(false);

  useEffect(() => {
    const checkRole = () => {
      const role = getUserRole();

      if (!role) {
        router.push('/login');
      } else {
        // Map 'instructor' to 'admin' for dashboard purposes
        const mappedRole = role === 'instructor' ? 'admin' : role;

        if (mappedRole !== allowedRole) {
          router.push('/not-authorized');
        } else {
          setLoading(false); // authorized
        }
      }
      setRoleChecked(true);
    };

    // Wait a tiny bit to ensure localStorage has the token (especially after signup)
    const timeout = setTimeout(checkRole, 50);

    return () => clearTimeout(timeout);
  }, [router, allowedRole]);

  if (loading && !roleChecked) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-gray-500 animate-pulse">Checking permissions...</p>
      </div>
    );
  }

  return <>{children}</>;
}
