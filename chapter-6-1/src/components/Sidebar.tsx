import { Link, useLocation } from "react-router-dom";
import { SearchIcon } from "./icons/SearchIcon";
import { UserIcon } from "./icons/UserIcon";

interface NavLinkProps {
  to: string;
  icon: React.ReactNode;
  label: string;
}

const NavLink = ({ to, icon, label }: NavLinkProps) => {
  const location = useLocation();
  const isActive = location.pathname === to;

  return (
    <li>
      <Link
        to={to}
        className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors
          ${
            isActive
              ? "bg-blue-600 text-white font-semibold"
              : "text-gray-600 hover:bg-gray-200"
          }`}
      >
        <span className="flex-shrink-0">{icon}</span>
        <span className="whitespace-nowrap">{label}</span>
      </Link>
    </li>
  );
};

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const Sidebar = ({ isOpen, onClose }: SidebarProps) => {
  return (
    <>
      <aside
        className={`
          bg-gray-100 shadow-md flex-shrink-0 overflow-hidden 
          transition-transform duration-300 ease-in-out
          md:transition-[width,padding] md:duration-300 md:ease-in-out
          fixed inset-y-0 left-0 z-20 p-4
          ${isOpen ? "translate-x-0" : "-translate-x-full"}
          md:static md:z-auto md:translate-x-0
          ${isOpen ? "md:w-64 md:p-4" : "md:w-0 md:p-0"}
        `}
      >
        <nav
          className={`
            pt-16 md:pt-0
          `}
        >
          <ul className="space-y-2">
            <NavLink
              to="/search"
              icon={<SearchIcon className="w-5 h-5" />}
              label="검색"
            />
            <NavLink
              to="/my"
              icon={<UserIcon className="w-5 h-5" />}
              label="마이페이지"
            />
          </ul>
        </nav>
      </aside>
    </>
  );
};

export default Sidebar;
