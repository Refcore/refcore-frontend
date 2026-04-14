import Notifications from '@/components/admin/notification/Notifications';
import PageHeader from '@/components/shared/PageHeader';
import React from 'react';

const NotificationsPage = () => {
  return (
    <div className="m-3 mb-10 lg:m-6 relative space-y-6">
      <PageHeader
        title="Notifications"
        description="  All updates across your contests, referrals, and admin activity"
      />
      <Notifications/>
    </div>
  );
};

export default NotificationsPage;
