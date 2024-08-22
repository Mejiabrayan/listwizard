'use client';

import React, { useState, useCallback } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Image from 'next/image';

interface ImageUploadProps {
  onImageUpload: (imageData: string | null) => void;
}

const ImageUpload: React.FC<ImageUploadProps> = ({ onImageUpload }) => {
  const [image, setImage] = useState<string | null>(null);

  const handleImageUpload = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const imageData = reader.result as string;
        setImage(imageData);
        onImageUpload(imageData);
      };
      reader.readAsDataURL(file);
    }
  }, [onImageUpload]);

  const handleRemoveImage = useCallback(() => {
    setImage(null);
    onImageUpload(null);
  }, [onImageUpload]);

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="image">Upload Image</Label>
        <Input id="image" type="file" accept="image/*" onChange={handleImageUpload} />
      </div>
      {image && (
        <div className="relative w-full h-64">
          <Image
            src={image}
            alt="Uploaded image"
            fill
            style={{ objectFit: 'contain' }}
          />
        </div>
      )}
      {image && (
        <Button className="w-full" onClick={handleRemoveImage}>
          Remove Image
        </Button>
      )}
    </div>
  );
};

export default ImageUpload;