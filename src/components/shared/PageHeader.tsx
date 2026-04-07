import React from 'react';

const PageHeader = ({
  title,
  description,
}: {
  title: string;
  description: string;
}) => {
  return (
    <div className='lg:sticky top-0 py-3 z-1 bg-background'>
      <h3 className='text-2xl font-bold -leading-2.5'>{title}</h3>
      <p className='text-muted-foreground text-lg font-semibold'>{description}</p>
    </div>
  );
};

export default PageHeader;
