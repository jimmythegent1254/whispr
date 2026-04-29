import { orpc } from "@/utils/orpc";
import { useQuery } from "@tanstack/react-query";

const Home = () => {
  const healthCheck = useQuery(orpc.healthCheck.queryOptions());

  return <div>Home</div>;
};

export default Home;
