import { Suspense } from 'react';
import ClientWrapper from './ClientWrapper';

export default function SubmitPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ClientWrapper />
    </Suspense>
  );
}
