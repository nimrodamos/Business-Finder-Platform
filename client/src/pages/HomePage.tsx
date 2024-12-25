import { useEffect, useState } from "react";
import { api } from "../api";

const HomePage = () => {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await api.get("/businesses"); // שים לב להתאים את הנתיב לשרת שלך
        setData(response.data.businesses || []);
      } catch (err) {
        setError("Failed to fetch data.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Businesses</h1>
      <ul className="space-y-2">
        {data.map((business) => (
          <li key={business._id} className="border p-4 rounded-md">
            <h2 className="text-lg font-semibold">{business.name}</h2>
            <p>{business.description}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default HomePage;
