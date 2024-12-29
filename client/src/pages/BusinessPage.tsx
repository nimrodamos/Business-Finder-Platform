import { useEffect, useState } from "react";
import { api } from "@/api/api";
import { Business } from "@/types/business";
import { Link, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";

const HomePage = () => {
  const { id } = useParams<{ id: string }>();
  const [business, setBusiness] = useState<Business | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBusiness = async () => {
      try {
        const response = await api.get(`/businesses?id=${id}`);
        setBusiness(response.data.business);
      } catch (err) {
        setError("Failed to load businesses details.");
      } finally {
        setLoading(false);
      }
    };

    fetchBusiness();
  }, [id]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  if (!business) return <p>Business not found.</p>;

  return (
    <div className="p-4">
      <h1 className="text-3xl font-bold text-primary">{business.name}</h1>
      <p>{business.description}</p>
      <p className="text-sm">Category: {business.category}</p>
      <p className="text-sm">Subscribers: {business.subscribers.length}</p>
      <p className="text-sm">Owner: {business.owner.name}</p>
      <Link to={"/"}>
        <Button>back to Businesses</Button>
      </Link>
    </div>
  );
};

export default HomePage;
