import Link from "next/link";
import { useRouter } from "next/router";
import { House, CircleUser, LogOut, Compass } from "lucide-react";

const Sidebar: React.FC = () => {
  const router = useRouter();

  const handleLogout = () => {
    // Hapus token atau informasi login dari localStorage
    localStorage.removeItem("token");

    // Redirect ke halaman login setelah logout
    router.push("/login");
  };

  return (
    <aside className="w-64 min-h-full text-black flex flex-col justify-between glassmorphism">
      <div className="p-6 ml-[1vw]">
        <h2 className="text-2xl font-bold mb-[10vh]">
          Snap<span className="text-green-700">Feed</span>
        </h2>
        <nav className="mt-4">
          <ul className="flex flex-col gap-8">
            <li>
              <Link href="/">
                <button className="flex items-center gap-3 font-bold">
                  <House size={30} strokeWidth="2" />
                  Home
                </button>
              </Link>
            </li>
            <li>
              <Link href="/explore">
                <button className="flex items-center gap-3 font-bold">
                  <Compass size={30} strokeWidth="2" />
                  Explore
                </button>
              </Link>
            </li>
            <li>
              <Link href="/profile">
                <button className="flex items-center gap-3 font-bold">
                  <CircleUser size={30} strokeWidth="2" />
                  Profile
                </button>
              </Link>
            </li>
          </ul>
        </nav>
      </div>

      <div className="p-6 ml-[1vw]">
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 font-bold"
        >
          <LogOut size={30} strokeWidth="2" />
          Logout
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
