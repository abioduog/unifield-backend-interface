import { Inter } from "next/font/google";
import "../globals.css";
import AdminLayout from '../../components/admin/AdminLayout';

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "UniField Admin",
  description: "Admin interface for UniField",
};

export default function AdminRootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AdminLayout>{children}</AdminLayout>
      </body>
    </html>
  );
}