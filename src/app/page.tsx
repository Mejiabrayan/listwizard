'use client'  
import React, { useReducer, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { toast } from "@/components/ui/use-toast";
import ImageUpload from '@/components/image-upload'
import ListingPreview from '@/components/list-preview';

type State = {
  title: string;
  description: string;
  price: string;
};

type Action =
  | { type: 'SET_TITLE'; payload: string }
  | { type: 'SET_DESCRIPTION'; payload: string }
  | { type: 'SET_PRICE'; payload: string }
  | { type: 'SET_ALL'; payload: State }
  | { type: 'RESET' };

const initialState: State = {
  title: '',
  description: '',
  price: '',
};

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case 'SET_TITLE':
      return { ...state, title: action.payload };
    case 'SET_DESCRIPTION':
      return { ...state, description: action.payload };
    case 'SET_PRICE':
      return { ...state, price: action.payload };
    case 'SET_ALL':
      return { ...action.payload };
    case 'RESET':
      return initialState;
    default:
      return state;
  }
}

export default function ListWizard() {
  const [state, dispatch] = useReducer(reducer, initialState);
  const [image, setImage] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const handleImageUpload = (imageData: string | null) => {
    setImage(imageData);
    setShowPreview(false);
    setIsEditing(false);
    dispatch({ type: 'RESET' });
  };

  const generateListing = async () => {
    if (!image) {
      toast({
        title: "Error",
        description: "Please upload an image first.",
        variant: "destructive",
      });
      return;
    }

    setIsGenerating(true);
    setShowPreview(false);
    setIsEditing(false);
    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ image }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to generate listing');
      }

      const data = await response.json();
      dispatch({ type: 'SET_ALL', payload: data });
      setShowPreview(true);
      toast({
        title: "Success",
        description: "Listing generated successfully!",
      });
    } catch (error) {
      console.error('Error:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to generate listing. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleEdit = () => {
    setIsEditing(true);
    setShowPreview(false);
  };

  const handleSaveEdit = () => {
    setIsEditing(false);
    setShowPreview(true);
  };

  const handlePost = () => {
    // TODO: Implement posting to marketplace
    toast({
      title: "Info",
      description: "Posting to marketplace functionality not yet implemented.",
    });
  };

  const renderForm = () => (
    <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
      {!isEditing && <ImageUpload onImageUpload={handleImageUpload} />}
      <div className="space-y-2">
        <Label htmlFor="title">Title</Label>
        <Input 
          id="title" 
          value={state.title}
          onChange={(e) => dispatch({ type: 'SET_TITLE', payload: e.target.value })}
          placeholder="Enter title" 
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea 
          id="description" 
          value={state.description}
          onChange={(e) => dispatch({ type: 'SET_DESCRIPTION', payload: e.target.value })}
          placeholder="Enter description" 
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="price">Price</Label>
        <Input 
          id="price" 
          type="number" 
          value={state.price}
          onChange={(e) => dispatch({ type: 'SET_PRICE', payload: e.target.value })}
          placeholder="Enter price" 
        />
      </div>
      {isEditing ? (
        <Button className="w-full" onClick={handleSaveEdit}>Save Changes</Button>
      ) : (
        <Button 
          className="w-full" 
          onClick={generateListing} 
          disabled={!image || isGenerating}
        >
          {isGenerating ? 'Generating...' : 'Generate Listing'}
        </Button>
      )}
    </form>
  );

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">ListWizard</CardTitle>
        </CardHeader>
        <CardContent>
          {showPreview ? (
            <ListingPreview
              title={state.title}
              description={state.description}
              price={state.price}
              imageUrl={image || ''}
              onEdit={handleEdit}
              onPost={handlePost}
            />
          ) : (
            renderForm()
          )}
        </CardContent>
      </Card>
    </div>
  );
}