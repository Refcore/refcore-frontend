import ParticipantsTable from '@/components/admin/participants/ParticipantsTable';
import PageHeader from '@/components/shared/PageHeader';
import { participantsDemoData } from '@/demo/participantsData';
import React from 'react';

const ParticipantsPage = () => {
  return (
    <div className="m-3 mb-10 lg:m-6 relative space-y-6">
      <PageHeader
        title="Participants"
        description="Overview of the participants accross yopur various contests"
      />
      <ParticipantsTable
        currentPage={1}
        totalPages={5}
        canPreviousPage={false}
        canNextPage={false}
        participants={participantsDemoData}
      />
    </div>
  );
};

export default ParticipantsPage;
