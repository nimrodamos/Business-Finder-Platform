import React from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "../components/ui/card";

interface BusinessCardProps {
  name: string;
  description: string;
  category: string;
  subscribersCount: number;
}

const BusinessCard: React.FC<BusinessCardProps> = ({
  name,
  description,
  category,
  subscribersCount,
}) => {
  return (
    <Card className="bg-card text-card-foreground border border-border rounded-lg shadow-md hover:shadow-lg transition-shadow">
      <CardHeader>
        <CardTitle className="text-xl font-bold">{name}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-secondary-foreground">{description}</p>
        <p className="text-sm text-primary mt-2">Category: {category}</p>
        <p className="text-sm text-primary mt-1">
          Subscribers: {subscribersCount}
        </p>
      </CardContent>
    </Card>
  );
};

export default BusinessCard;
