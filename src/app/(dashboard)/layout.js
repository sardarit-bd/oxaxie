import DashboardNavbar from "../../components/DashboardNavbar";
import { cookies } from "next/headers";

export default async function DashboardLayout({ children }) {
    const cookieStore = await cookies();
    const authToken = cookieStore.get("authToken")?.value;
    const userName = cookieStore.get("name")?.value;
    
    const isLoggedIn = !!authToken;

    return (
        <>
            <DashboardNavbar isLoggedIn={isLoggedIn} userName={userName} />
            <main>
                {children}
            </main>
        </>
    );
}