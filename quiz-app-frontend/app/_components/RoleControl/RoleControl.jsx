import { useAuth } from "@/app/_context/AuthContext";

export default function RoleControl({ children, allowedRoles=[] }){
    const {userProfile} = useAuth()

    if (!userProfile?.role) return null;

    if(allowedRoles.includes(userProfile.role)){
        return children;
    }

    return null;
}