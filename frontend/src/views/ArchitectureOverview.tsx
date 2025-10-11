import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Database, Globe, Server } from 'lucide-react';
import { Link } from 'react-router-dom';

export function ArchitectureOverview() {
  return (
    <div className="container mx-auto px-4 py-16">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">Three-Tier Architecture</h1>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Our solution follows the proven three-tier architecture pattern, ensuring separation of concerns, scalability,
          and maintainability. Built with modern technologies and deployed on AWS infrastructure.
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto mb-16">
        {/* Presentation Tier */}
        <Card className="relative overflow-hidden group hover:shadow-lg transition-shadow">
          <CardHeader>
            <div className="w-12 h-12 bg-muted rounded-lg flex items-center justify-center mb-4">
              <Globe className="h-6 w-6" />
            </div>
            <CardTitle>Presentation Tier</CardTitle>
            <CardDescription>React frontend with AWS CloudFront distribution</CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-sm text-muted-foreground mb-4">
              <li>• React 18 with TypeScript</li>
              <li>• Responsive design with Tailwind CSS</li>
              <li>• React Router for client-side routing</li>
              <li>• AWS CloudFront CDN</li>
              <li>• S3 static site hosting</li>
              <li>• AWS Cognito authentication</li>
            </ul>
          </CardContent>
        </Card>

        {/* Application Tier */}
        <Card className="relative overflow-hidden group hover:shadow-lg transition-shadow border-2">
          <CardHeader>
            <div className="w-12 h-12 bg-muted rounded-lg flex items-center justify-center mb-4">
              <Server className="h-6 w-6" />
            </div>
            <CardTitle>Application Tier</CardTitle>
            <CardDescription>FastAPI backend deployed as AWS Lambda functions</CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-sm text-muted-foreground mb-4">
              <li>• FastAPI with Python 3.12</li>
              <li>• Docker containerized Lambda</li>
              <li>• API Gateway with CORS</li>
              <li>• JWT authentication via Cognito</li>
              <li>• SQLModel ORM with PostgreSQL</li>
              <li>• Comprehensive error handling</li>
            </ul>
            <Link to="/application-tier" className="!text-black underline underline-offset-4 hover:!text-black/80">
              Explore Application Tier
            </Link>
          </CardContent>
        </Card>

        {/* Data Tier */}
        <Card className="relative overflow-hidden group hover:shadow-lg transition-shadow">
          <CardHeader>
            <div className="w-12 h-12 bg-muted rounded-lg flex items-center justify-center mb-4">
              <Database className="h-6 w-6" />
            </div>
            <CardTitle>Data Tier</CardTitle>
            <CardDescription>Aurora PostgreSQL with RDS Proxy</CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-sm text-muted-foreground mb-4">
              <li>• Aurora PostgreSQL serverless</li>
              <li>• RDS Proxy for connection pooling</li>
              <li>• Alembic for schema migrations</li>
              <li>• IAM database authentication</li>
              <li>• VPC isolation for security</li>
              <li>• Automated backups & recovery</li>
            </ul>
          </CardContent>
        </Card>
      </div>

      {/* AWS Infrastructure Details */}
      <div className="bg-muted/50 rounded-lg p-8 mb-12">
        <h2 className="text-2xl font-bold mb-6 text-center">AWS Infrastructure Overview</h2>
        <div className="grid md:grid-cols-2 gap-8">
          <div>
            <h3 className="font-semibold mb-4">Core AWS Services</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                • <strong>AWS CDK</strong> - Infrastructure as Code
              </li>
              <li>
                • <strong>Lambda</strong> - Serverless compute with container images
              </li>
              <li>
                • <strong>API Gateway</strong> - RESTful API management
              </li>
              <li>
                • <strong>Aurora PostgreSQL</strong> - Managed relational database
              </li>
              <li>
                • <strong>RDS Proxy</strong> - Connection pooling and failover
              </li>
              <li>
                • <strong>CloudFront</strong> - Global content distribution
              </li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold mb-4">Security & Operations</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                • <strong>Cognito</strong> - User authentication and authorization
              </li>
              <li>
                • <strong>VPC</strong> - Network isolation and security
              </li>
              <li>
                • <strong>Secrets Manager</strong> - Environment variable management
              </li>
              <li>
                • <strong>IAM</strong> - Fine-grained access control
              </li>
              <li>
                • <strong>EC2</strong> - Database access connector
              </li>
              <li>
                • <strong>SSM Session Manager</strong> - Secure database access
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Architecture Benefits */}
      <div className="bg-muted/50 rounded-lg p-8 mb-12">
        <h2 className="text-2xl font-bold mb-6 text-center">Architecture Benefits</h2>
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <h3 className="font-semibold mb-2">Serverless Scalability</h3>
            <p className="text-sm text-muted-foreground">
              AWS Lambda automatically scales based on demand, ensuring optimal performance and cost efficiency.
            </p>
          </div>
          <div>
            <h3 className="font-semibold mb-2">Database Resilience</h3>
            <p className="text-sm text-muted-foreground">
              Aurora PostgreSQL with RDS Proxy provides automatic failover and connection management.
            </p>
          </div>
          <div>
            <h3 className="font-semibold mb-2">Security by Design</h3>
            <p className="text-sm text-muted-foreground">
              VPC isolation, IAM authentication, and Cognito provide multiple layers of security.
            </p>
          </div>
          <div>
            <h3 className="font-semibold mb-2">DevOps Excellence</h3>
            <p className="text-sm text-muted-foreground">
              Infrastructure as Code with CDK, automated migrations, and container deployments.
            </p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="text-center">
        <Link to="/" className="!text-black underline underline-offset-4 hover:!text-black/80">
          Back to Home
        </Link>
      </div>
    </div>
  );
}
