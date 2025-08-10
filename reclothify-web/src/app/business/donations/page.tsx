'use client';
import { useAuth } from '@/contexts/AuthContext';
import { useEffect, useState } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../../../../lib/firebase';

interface Donation {
  id: string;
  name: string;
  phone: string;
  clothType: string;
  weight: number;
  status: string;
}

export default function BusinessDonations() {
  const { user } = useAuth();
  const [donations, setDonations] = useState<Donation[]>([]);
  
  useEffect(() => {
    getDocs(collection(db, 'donations')).then(snap => 
      setDonations(snap.docs.map(d => ({ id: d.id, ...d.data() } as Donation)))
    );
  }, []);
  
  if (!user) return <div>Unauthorized</div>;
  
  return (
    <main className="max-w-3xl mx-auto py-8">
      <h2 className="text-xl font-bold mb-4">All Donations</h2>
      <ul>
        {donations.map((d) => (
          <li key={d.id} className="p-2 border-b">
            <span>{d.name}</span> ({d.phone}) - {d.clothType} {d.weight}kg - {d.status}
          </li>
        ))}
      </ul>
    </main>
  );
}
