import Link from "next/link";
import { auth } from "@/auth";

export const dynamic = 'force-dynamic';


export default async function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const session = await auth();
    const role = session?.user?.role;

    return (
        <div className="container py-10 print:p-0 print:m-0 print:max-w-none print:w-full">
            <div className="flex flex-col md:flex-row gap-8 print:block print:gap-0">
                <aside className="w-full md:w-64 space-y-4 print:hidden">
                    <h2 className="text-xl font-bold">Admin Panel</h2>
                    <nav className="flex flex-col space-y-2">
                        <Link href="/admin" className="text-sm hover:underline">Overview</Link>
                        <Link href="/admin/products" className="text-sm hover:underline">Products</Link>
                        <Link href="/admin/orders" className="text-sm hover:underline">Orders</Link>
                        {role === "SUPER_ADMIN" && (
                            <Link href="/admin/super" className="text-sm hover:underline font-bold text-purple-600">Super Admin</Link>
                        )}
                    </nav>
                </aside>
                <main className="flex-1">{children}</main>
            </div>
        </div>
    );
}
