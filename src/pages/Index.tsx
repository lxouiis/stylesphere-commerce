import { Navigation } from "@/components/Navigation";
import { Hero } from "@/components/Hero";
import { CategoryCard } from "@/components/CategoryCard";
import categoryMen from "@/assets/category-men.jpg";
import categoryWomen from "@/assets/category-women.jpg";
import categoryKids from "@/assets/category-kids.jpg";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <Hero />
      
      <div className="container mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold text-center mb-12">Shop by Category</h2>
        
        <div className="grid md:grid-cols-3 gap-8">
          <CategoryCard
            title="Men's Fashion"
            image={categoryMen}
            category="men"
          />
          <CategoryCard
            title="Women's Fashion"
            image={categoryWomen}
            category="women"
          />
          <CategoryCard
            title="Kids' Fashion"
            image={categoryKids}
            category="kids"
          />
        </div>
      </div>
    </div>
  );
};

export default Index;
