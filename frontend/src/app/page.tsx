import AuthButton from '@/components/AuthButton';
import RegistrationForm from '@/components/RegistrationForm';

export default function Home() {
  // Using our test UUID for local dev verification
  const testUserId = '11111111-1111-1111-1111-111111111111';

  return (
    <main className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <header className="flex justify-between items-center bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Campus Matchday Portal</h1>
            <p className="text-sm text-gray-500">Official Staff vs. Student Football Derby</p>
          </div>
          <AuthButton />
        </header>

        <section className="mt-8">
          <RegistrationForm userId={testUserId} />
        </section>
      </div>
    </main>
  );
}