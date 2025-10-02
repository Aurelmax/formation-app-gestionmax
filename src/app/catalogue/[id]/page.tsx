import { use } from 'react';
import { notFound } from 'next/navigation';
import { PublicLayout } from '@/components/layouts/public/PublicLayout';
import { ProgrammeModalWrapper } from '@/components/ui/programme-modal-wrapper';
import { MOCK_PROGRAMMES } from '@/data/mock-data';

interface ProgrammePageProps {
  params: Promise<{
    id: string;
  }>;
}

export default function ProgrammePage({ params }: ProgrammePageProps) {
  const { id } = use(params);
  const programme = MOCK_PROGRAMMES.find(p => p.id === id);

  if (!programme) {
    notFound();
  }

  return (
    <PublicLayout>
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-6">
          <ProgrammeModalWrapper programme={programme} />
        </div>
      </div>
    </PublicLayout>
  );
}
