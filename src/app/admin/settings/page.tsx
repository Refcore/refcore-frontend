'use client';

import PageHeader from '@/components/shared/PageHeader';
import React from 'react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { settingsTabs } from '@/components/admin/settings/settingsTab';
import ChannelSettingsSection from '@/components/admin/settings/channel/ChannelSettingsSection';
import { useAuthContext } from '@/context/AuthContext';
import AccountSettingsSection from '@/components/admin/settings/account/AccountSettingsSection';
import ContestDefaultsSection from '@/components/admin/settings/contests/ContestDefaultSection';
import RefferalRulesSection from '@/components/admin/settings/rules/RefferalRulesSection';
import NotificationsSettingsSection from '@/components/admin/settings/notifications/NotificationsSettingsSection';

const SettingsPage = () => {
  const { myChannel, currentUser } = useAuthContext();

  if (!currentUser || !myChannel) {
    return (
      <div className="m-3 mb-10 lg:m-6">
        <div className="rounded-xl border border-white/10 bg-white/5 p-6 text-sm text-white/70">
          Loading settings...
        </div>
      </div>
    );
  }

  return (
    <div className="m-3 mb-10 lg:m-6 relative space-y-6">
      <PageHeader
        title="Settings"
        description="Manage your account, channel, contest defaults, referral rules, notifications, and security preferences"
      />

      <Tabs defaultValue={settingsTabs[0].value} className="w-full space-y-6">
        <TabsList className="md:h-auto w-full flex-wrap justify-start gap-2 rounded-xl bg-white/5 p-1">
          {settingsTabs.map((tab) => (
            <TabsTrigger
              key={tab.value}
              value={tab.value}
              className="shrink-0 rounded-xl px-4 md:py-2.5 text-sm"
            >
              {tab.label}
            </TabsTrigger>
          ))}
        </TabsList>

        <TabsContent value="account">
          <AccountSettingsSection user={currentUser!} />
        </TabsContent>

        <TabsContent value="channel">
          <ChannelSettingsSection channel={myChannel!} />
        </TabsContent>

        <TabsContent value="contest_defaults">
          <ContestDefaultsSection />
        </TabsContent>

        <TabsContent value="referral_rules">
          <RefferalRulesSection />
        </TabsContent>

        <TabsContent value="notifications">
          <NotificationsSettingsSection />
        </TabsContent>


      </Tabs>
    </div>
  );
};

export default SettingsPage;
