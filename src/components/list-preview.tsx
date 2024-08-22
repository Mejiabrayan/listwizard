import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Image from 'next/image';

interface ListingPreviewProps {
  title: string;
  description: string;
  price: string;
  imageUrl: string;
  onEdit: () => void;
  onPost: () => void;
}

const ListingPreview: React.FC<ListingPreviewProps> = ({
  title,
  description,
  price,
  imageUrl,
  onEdit,
  onPost
}) => {
  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle className="text-xl font-bold">{title}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="relative w-full h-64">
          <Image
            src={imageUrl}
            alt={title}
            fill
            style={{ objectFit: 'cover' }}
          />
        </div>
        <p className="text-gray-700">{description}</p>
        <p className="text-lg font-semibold">Price: ${price}</p>
        <div className="flex justify-between">
          <Button variant="outline" onClick={onEdit}>Edit Listing</Button>
          <Button onClick={onPost}>Post Listing</Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default ListingPreview;