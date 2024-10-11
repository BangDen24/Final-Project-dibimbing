import ProtectedRoute from "@/config/ProtectedRoute";
import HomePage from "@/components/features/homePage/home";

const Home = () => {
  return (
    <ProtectedRoute>
      <HomePage />
    </ProtectedRoute>
  );
};

export default Home;
