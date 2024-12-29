import { useEffect, useState } from "react";
import { api } from "@/api/api";
import { Business } from "@/types/business";
import BusinessCard from "@/components/BusinessCard";
import { useNavigate } from "react-router-dom";

const HomePage = () => {
  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleCardClick = (id: string) => {
    navigate(`/businesses/${id}`);
  };

  useEffect(() => {
    const fetchBusinesses = async () => {
      try {
        const response = await api.get("/businesses");
        setBusinesses(response.data.businesses || []);
      } catch (err) {
        setError("Failed to load businesses.");
      } finally {
        setLoading(false);
      }
    };

    fetchBusinesses();
  }, []);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="p-4">
      <h1 className="text-primary text-3xl font-bold mb-4">Businesses</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {businesses.map((business) => (
          <div key={business._id} onClick={() => handleCardClick(business._id)}>
            <BusinessCard
              key={business._id}
              name={business.name}
              description={business.description}
              category={business.category}
              subscribersCount={business.subscribers.length}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default HomePage;
