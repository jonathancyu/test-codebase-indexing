import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Server, Shield, Database, Code, GitBranch, Monitor, ArrowLeft, Package, Settings, Layers } from 'lucide-react';
import { Link } from 'react-router-dom';

export function ApplicationTier() {
  return (
    <div className="container mx-auto px-4 py-16">
      {/* Header */}
      <div className="text-center mb-12">
        <Badge variant="secondary" className="mb-4">
          FastAPI Application Tier
        </Badge>
        <h1 className="text-4xl font-bold mb-4 flex items-center justify-center gap-3">
          <div className="w-12 h-12 bg-muted rounded-lg flex items-center justify-center">
            <Server className="h-6 w-6" />
          </div>
          Application Tier
        </h1>
        <p className="text-muted-foreground max-w-3xl mx-auto text-lg">
          Built with FastAPI and deployed as containerized AWS Lambda functions, our application tier provides
          high-performance RESTful APIs with comprehensive user management capabilities.
        </p>
      </div>

      {/* Core Components */}
      <section className="mb-16">
        <h2 className="text-2xl font-bold mb-8 text-center">Core Components</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <div className="w-10 h-10 bg-muted rounded-lg flex items-center justify-center mb-3">
                <Code className="h-5 w-5" />
              </div>
              <CardTitle className="text-lg">FastAPI Framework</CardTitle>
              <CardDescription>Modern, fast Python web framework for APIs</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-1 text-sm text-muted-foreground">
                <li>• Automatic OpenAPI documentation</li>
                <li>• Type hints with Pydantic models</li>
                <li>• Async/await support</li>
                <li>• Request/response validation</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="w-10 h-10 bg-muted rounded-lg flex items-center justify-center mb-3">
                <Package className="h-5 w-5" />
              </div>
              <CardTitle className="text-lg">AWS Lambda Deployment</CardTitle>
              <CardDescription>Containerized serverless functions</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-1 text-sm text-muted-foreground">
                <li>• Docker container images</li>
                <li>• Automatic scaling</li>
                <li>• Pay-per-execution pricing</li>
                <li>• Integrated with API Gateway</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="w-10 h-10 bg-muted rounded-lg flex items-center justify-center mb-3">
                <Shield className="h-5 w-5" />
              </div>
              <CardTitle className="text-lg">API Gateway & Auth</CardTitle>
              <CardDescription>Managed API with Cognito authentication</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-1 text-sm text-muted-foreground">
                <li>• JWT token validation</li>
                <li>• CORS configuration</li>
                <li>• Request throttling</li>
                <li>• Authorization scopes</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="w-10 h-10 bg-muted rounded-lg flex items-center justify-center mb-3">
                <Database className="h-5 w-5" />
              </div>
              <CardTitle className="text-lg">Database Integration</CardTitle>
              <CardDescription>SQLModel ORM with Aurora PostgreSQL</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-1 text-sm text-muted-foreground">
                <li>• SQLModel for type-safe queries</li>
                <li>• Connection pooling via RDS Proxy</li>
                <li>• IAM database authentication</li>
                <li>• Session management</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="w-10 h-10 bg-muted rounded-lg flex items-center justify-center mb-3">
                <GitBranch className="h-5 w-5" />
              </div>
              <CardTitle className="text-lg">Database Migrations</CardTitle>
              <CardDescription>Alembic for schema management</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-1 text-sm text-muted-foreground">
                <li>• Automated schema versioning</li>
                <li>• Migration generation</li>
                <li>• Rollback capabilities</li>
                <li>• CI/CD integration</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="w-10 h-10 bg-muted rounded-lg flex items-center justify-center mb-3">
                <Monitor className="h-5 w-5" />
              </div>
              <CardTitle className="text-lg">Observability</CardTitle>
              <CardDescription>Comprehensive logging and monitoring</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-1 text-sm text-muted-foreground">
                <li>• Structured logging</li>
                <li>• Request/response tracking</li>
                <li>• Error handling & reporting</li>
                <li>• Health check endpoints</li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Technical Architecture */}
      <section className="mb-16">
        <h2 className="text-2xl font-bold mb-8 text-center">Technical Architecture</h2>
        <div className="grid md:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <div className="w-10 h-10 bg-muted rounded-lg flex items-center justify-center mb-3">
                <Layers className="h-5 w-5" />
              </div>
              <CardTitle className="text-lg">Service Architecture</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>• Controller layer for HTTP handling</li>
                <li>• Service layer for business logic</li>
                <li>• Repository pattern for data access</li>
                <li>• Dependency injection with FastAPI</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="w-10 h-10 bg-muted rounded-lg flex items-center justify-center mb-3">
                <Settings className="h-5 w-5" />
              </div>
              <CardTitle className="text-lg">Configuration</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>• Environment-based configuration</li>
                <li>• AWS Secrets Manager integration</li>
                <li>• Secure credential management</li>
                <li>• Runtime environment detection</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="w-10 h-10 bg-muted rounded-lg flex items-center justify-center mb-3">
                <Package className="h-5 w-5" />
              </div>
              <CardTitle className="text-lg">Deployment</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>• Docker multi-stage builds</li>
                <li>• AWS CDK infrastructure provisioning</li>
                <li>• Automated CI/CD pipelines</li>
                <li>• Blue-green deployment strategy</li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Development Features */}
      <section className="mb-16">
        <div className="bg-muted/50 rounded-lg p-8">
          <h2 className="text-2xl font-bold mb-6 text-center">Development & Operations</h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h3 className="font-semibold mb-4">Local Development</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>• Docker Compose for local environment</li>
                <li>• Service connections for Aurora access</li>
                <li>• Hot reload with uvicorn</li>
                <li>• Interactive API documentation at /docs</li>
                <li>• Local PostgreSQL container support</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Production Features</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>• VPC isolation for security</li>
                <li>• Auto-scaling based on traffic</li>
                <li>• Connection pooling via RDS Proxy</li>
                <li>• Centralized logging and monitoring</li>
                <li>• Automated database migrations</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Navigation */}
      <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
        <Link to="/architecture" className="!text-black underline underline-offset-4 hover:!text-black/80">
          <ArrowLeft className="mr-2 h-4 w-4 inline" />
          Back to Architecture
        </Link>
        <Link to="/" className="!text-black underline underline-offset-4 hover:!text-black/80">
          Back to Home
        </Link>
      </div>
    </div>
  );
}
