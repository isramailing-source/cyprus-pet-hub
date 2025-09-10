import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

interface Category {
  id: string;
  name: string;
  description: string;
  icon: string;
}

interface ForumCategoriesProps {
  categories: Category[];
  onSelectCategory: (category: Category) => void;
  loading: boolean;
}

export const ForumCategories = ({ categories, onSelectCategory, loading }: ForumCategoriesProps) => {
  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(6)].map((_, i) => (
          <Card key={i} className="cursor-pointer hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-center gap-3">
                <Skeleton className="h-8 w-8 rounded" />
                <Skeleton className="h-6 w-32" />
              </div>
            </CardHeader>
            <CardContent>
              <Skeleton className="h-4 w-full mb-2" />
              <Skeleton className="h-4 w-3/4" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {categories.map((category) => (
        <Card
          key={category.id}
          className="cursor-pointer hover:shadow-lg transition-shadow hover:bg-accent/50"
          onClick={() => onSelectCategory(category)}
        >
          <CardHeader>
            <CardTitle className="flex items-center gap-3">
              <span className="text-2xl">{category.icon}</span>
              <span className="text-lg">{category.name}</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <CardDescription className="text-sm">
              {category.description}
            </CardDescription>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};