import { useEffect, useState } from 'react';
import { MainLayout } from '@/components/layouts/MainLayout';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar, User, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { supabase } from '@/db/supabase';

interface Blog {
  id: string;
  title: string;
  description: string;
  image_url: string;
  category: string;
  author: string;
  published_date: string;
}

export default function BlogPage() {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const { data, error } = await supabase
          .from('blogs')
          .select('*')
          .order('published_date', { ascending: false });

        if (error) throw error;

        setBlogs(data || []);
      } catch (error) {
        console.error('Error fetching blogs:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchBlogs();
  }, []);

  return (
    <MainLayout>
      <div className="bg-primary text-primary-foreground py-12 md:py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-3xl md:text-4xl font-bold mb-4 text-balance">
            Our Blog
          </h1>

          <p className="text-lg max-w-2xl mx-auto text-pretty">
            Stay updated with the latest tech news, product reviews, and buying guides
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">

        {loading ? (
          <div className="text-center py-20">
            Loading blogs...
          </div>
        ) : blogs.length > 0 ? (

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

            {blogs.map((post) => (
              <Card
                key={post.id}
                className="h-full flex flex-col overflow-hidden hover:shadow-lg transition-shadow"
              >

                {/* Image */}
                <div className="aspect-video w-full overflow-hidden bg-muted">
                  <img
                    src={post.image_url}
                    alt={post.title}
                    className="h-full w-full object-cover transition-transform hover:scale-105"
                  />
                </div>

                <CardHeader className="pb-3">

                  {/* Category */}
                  <div className="flex items-center gap-2 mb-2">
                    <Badge variant="secondary" className="text-xs">
                      {post.category}
                    </Badge>
                  </div>

                  {/* Title */}
                  <h3 className="text-xl font-bold text-foreground line-clamp-2 text-balance">
                    {post.title}
                  </h3>
                </CardHeader>

                <CardContent className="flex-1 flex flex-col">

                  {/* Description */}
                  <p className="text-sm text-muted-foreground mb-4 line-clamp-3 text-pretty">
                    {post.description}
                  </p>

                  {/* Author + Date */}
                  <div className="flex items-center gap-4 text-xs text-muted-foreground mt-auto">

                    <div className="flex items-center gap-1">
                      <User className="h-3.5 w-3.5" />
                      <span>{post.author}</span>
                    </div>

                    <div className="flex items-center gap-1">
                      <Calendar className="h-3.5 w-3.5" />
                      <span>
                        {new Date(post.published_date).toLocaleDateString()}
                      </span>
                    </div>

                  </div>

                  {/* Button */}
                  <Button
                    variant="ghost"
                    className="mt-4 gap-2 justify-start px-0"
                    asChild
                  >
                    <a href="#">
                      Read More
                      <ArrowRight className="h-4 w-4" />
                    </a>
                  </Button>

                </CardContent>
              </Card>
            ))}

          </div>

        ) : (

          <div className="text-center py-20 text-muted-foreground">
            No blogs found
          </div>

        )}
      </div>
    </MainLayout>
  );
}