import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { ShoppingCart } from "lucide-react";

interface ProductCardProps {
  id: string;
  name: string;
  price: number;
  image_url: string | null;
  category: string;
}

export const ProductCard = ({ id, name, price, image_url, category }: ProductCardProps) => {
  const navigate = useNavigate();

  return (
    <Card className="group cursor-pointer overflow-hidden transition-all hover:shadow-card-hover">
      <div
        onClick={() => navigate(`/product/${id}`)}
        className="relative aspect-square overflow-hidden bg-muted"
      >
        {image_url ? (
          <img
            src={image_url}
            alt={name}
            className="object-cover w-full h-full transition-transform duration-300 group-hover:scale-110"
          />
        ) : (
          <div className="flex items-center justify-center h-full text-muted-foreground">
            No Image
          </div>
        )}
      </div>
      <CardContent className="p-4">
        <h3 className="font-semibold text-lg mb-2 line-clamp-2">{name}</h3>
        <div className="flex items-center justify-between">
          <p className="text-2xl font-bold text-primary">Rs. {price.toFixed(2)}</p>
          <Button
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              navigate(`/product/${id}`);
            }}
          >
            <ShoppingCart className="h-4 w-4 mr-2" />
            Add
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
