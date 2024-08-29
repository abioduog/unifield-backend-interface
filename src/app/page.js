import Link from 'next/link';

export default function Home() {
  return (
    <div>
      <h1>Welcome to UniField Backend Interface</h1>
      <p>Please choose an interface:</p>
      <ul>
        <li><Link href="/admin">Admin Interface</Link></li>
        <li><Link href="/retailer">Retailer Interface</Link></li>
      </ul>
    </div>
  );
}
