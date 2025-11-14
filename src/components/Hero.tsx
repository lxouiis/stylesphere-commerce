import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import heroImage from "@/assets/hero-fashion.jpg";

export const Hero = () => {
  const navigate = useNavigate();

  return (
    <div className="relative h-[600px] overflow-hidden">
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${heroImage})` }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-background/90 to-background/50" />
      </div>
      
      <div className="relative container mx-auto px-4 h-full flex items-center">
        <div className="max-w-2xl">
          <h1 className="text-5xl md:text-6xl font-bold mb-6 text-foreground">
            Discover Your Style
          </h1>
          <p className="text-xl mb-8 text-muted-foreground">
            Premium fashion for everyone. Shop the latest trends in men's, women's, and kids' clothing.
          </p>
          <div className="flex gap-4">
            <Button
              size="lg"
              className="bg-hero-gradient hover:opacity-90 transition-opacity"
              onClick={() => navigate("/products/women")}
            >
              Shop Women
            </Button>
            <Button
              size="lg"
              variant="outline"
              onClick={() => navigate("/products/men")}
            >
              Shop Men
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
