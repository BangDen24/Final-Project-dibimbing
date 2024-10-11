import ProtectedRoute from "@/config/ProtectedRoute";
import ExploreComponent from "@/components/features/explorePage/explore";

const Explore = () => {
  return (
    <ProtectedRoute>
      <ExploreComponent />
    </ProtectedRoute>
  );
};

export default Explore;
