import { Badge } from '@/components/ui/badge';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '../components/ui/button';

export function Home() {
  return (
    <div className="min-h-screen flex items-start pt-20">
      {/* Hero Section */}
      <section className="container mx-auto px-6 py-32 text-center w-full">
        <div className="max-w-5xl mx-auto">
          <Badge variant="secondary" className="mb-6 text-sm px-4 py-2">
            Enterprise-Ready Architecture
          </Badge>
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold mb-8">
            8090 Solutions
            <span className="block text-4xl md:text-6xl lg:text-7xl mt-4 text-muted-foreground">
              Three-Tier Application
            </span>
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground mb-12 max-w-3xl mx-auto leading-relaxed">
            A modern, scalable three-tier architecture solution designed for enterprise applications. Built with
            cutting-edge technologies and best practices for maximum performance and reliability.
          </p>
          <div className="flex flex-col sm:flex-row gap-6 justify-center mb-16">
            <Link to="/architecture">
              <Button size="lg" className="text-lg px-8 py-4">
                Explore Architecture
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
