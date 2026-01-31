

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { OrderStatusTimeline } from "@/components/order-status-timeline";
import { formatCurrency } from "@/lib/utils";
import { signOut } from "@/auth";
import { ProfileForm } from "@/components/profile/profile-form";
import { AddressManager } from "@/components/profile/address-manager";
import { OnboardingTour } from "@/components/onboarding-tour";
import { ProfileHeader } from "@/components/profile/profile-header";
import { OrderList } from "@/components/profile/order-list";
import { ForceSignout } from "@/components/force-signout";
import { TwoFactorSettings } from "@/components/two-factor-settings";

export const dynamic = 'force-dynamic';

export default async function ProfilePage() {
    const session = await auth();
    if (!session?.user) {
        redirect("/login");
    }

    const user = await prisma.user.findUnique({
        where: { id: session.user.id },
        select: {
            id: true,
            name: true,
            email: true,
            phone: true,
            hasSeenOnboarding: true,
            twoFactorEnabled: true,
            addresses: true,
        },
    });

    if (!user) {
        return <ForceSignout />;
    }

    const orders = await prisma.order.findMany({
        where: { userId: session.user.id },
        include: { items: { include: { product: true } } },
        orderBy: { createdAt: "desc" },
    });

    return (
        <div className="container py-10 space-y-8">
            <OnboardingTour hasSeenOnboarding={user.hasSeenOnboarding} />

            <ProfileHeader />

            <div className="grid gap-8 md:grid-cols-3">
                <div className="md:col-span-1 space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Personal Information</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <ProfileForm user={{
                                name: user.name,
                                email: user.email,
                                phone: user.phone,
                            }} />
                        </CardContent>
                    </Card>

                    <TwoFactorSettings
                        userId={user.id}
                        initialEnabled={user.twoFactorEnabled || false}
                        userEmail={user.email}
                    />
                </div>

                <div className="md:col-span-2 space-y-8">
                    <section>
                        <AddressManager addresses={user.addresses} />
                    </section>

                    <OrderList orders={orders} />
                </div>
            </div>
        </div>
    );
}
