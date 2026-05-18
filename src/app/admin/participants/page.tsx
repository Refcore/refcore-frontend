'use client';

import ParticipantsTable from '@/components/admin/participants/ParticipantsTable';
import PageHeader from '@/components/shared/PageHeader';
import TableLoader from '@/components/shared/TableLoader';
import { useGetParticipants } from '@/hooks/admin/participants/useGetParticipants';
import React, { useState } from 'react';

const ParticipantsPage = () => {
  const [page, setPage] = useState(1);

  const { data, isLoading } = useGetParticipants({
    page,
    limit: 20,
  });

  if (isLoading) {
    return <TableLoader rowCount={10} columnCount={7} />;
  }

  return (
    <div className="m-3 mb-10 lg:m-6 relative space-y-6">
      <PageHeader
        title="Participants"
        description="Overview of the participants accross yopur various contests"
      />
      <ParticipantsTable
        participants={data?.participants ?? []}
        currentPage={data?.pagination.page ?? 1}
        totalPages={data?.pagination.total_pages ?? 1}
        limitOnPage={data?.participants.length ?? 0}
        total={data?.pagination.total ?? 0}
        canPreviousPage={page > 1}
        canNextPage={page < (data?.pagination.total_pages ?? 1)}
        onPreviousPage={() => setPage((prev) => Math.max(prev - 1, 1))}
        onNextPage={() =>
          setPage((prev) =>
            Math.min(prev + 1, data?.pagination.total_pages ?? 1),
          )
        }
        onPageChange={setPage}
      />
    </div>
  );
};

export default ParticipantsPage;
