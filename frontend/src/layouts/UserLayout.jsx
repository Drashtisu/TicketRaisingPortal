import Header from '../components/layout/Header';
import Sidebar from '../components/layout/Sidebar';

const UserLayout = ({ children }) => {
  return (
    <div className="app-shell">
      <Sidebar />
      <div className="main-panel">
        <Header />
        <main className="content-area">{children}</main>
      </div>
    </div>
  );
};

export default UserLayout;
