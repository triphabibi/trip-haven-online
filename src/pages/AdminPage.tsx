
import AdminGuard from './AdminGuard';
import WordPressLikeAdminPanel from '@/components/admin/WordPressLikeAdminPanel';

const AdminPage = () => {
  return (
    <AdminGuard>
      <WordPressLikeAdminPanel />
    </AdminGuard>
  );
};

export default AdminPage;
