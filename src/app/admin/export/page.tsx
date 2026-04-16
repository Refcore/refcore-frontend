import ExportCard from '@/components/admin/export/ExportCard';
import RecentExportsTable from '@/components/admin/export/RecentExportsTable';
import PageHeader from '@/components/shared/PageHeader';
import { exportCardData, recentExportsData } from '@/demo/exportData';
import React from 'react';

const ExportPage = () => {
  return (
    <div className="m-3 mb-10 lg:m-6 relative space-y-6">
      <PageHeader
        title="Export"
        description="Download contest data, participant records, referral logs, and winner summaries"
      />
      <section className="grid grid-cols-1 gap-4 xl:grid-cols-2">
        {exportCardData.map((item) => (
          <ExportCard key={item.id} item={item} />
        ))}
      </section>

      <RecentExportsTable data={recentExportsData} />
    </div>
  );
};

export default ExportPage;
