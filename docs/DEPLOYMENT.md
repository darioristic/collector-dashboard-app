# Deployment Guide

## Overview

This guide covers deployment strategies for the financial microservices platform, including local development, staging, and production environments.

## Prerequisites

### Local Development
- Node.js 18+
- pnpm 8+
- Docker & Docker Compose
- PostgreSQL 14+
- Redis 6+
- RabbitMQ 3.9+

### Production
- Kubernetes cluster (OpenShift 4.x+ recommended)
- Helm 3+
- Prometheus & Grafana
- ELK Stack (optional)

## Local Development Setup

### 1. Infrastructure Services

Start required infrastructure services using Docker Compose:

```bash
# Start all infrastructure services
pnpm docker:up

# Or start individual services
docker-compose up -d postgres redis rabbitmq
```

### 2. Database Setup

Run database migrations for all services:

```bash
# Install dependencies
pnpm install

# Run migrations
pnpm db:migrate

# Seed development data (optional)
pnpm db:seed
```

### 3. Start Services

Start all microservices in development mode:

```bash
# Start all services with hot reload
pnpm dev

# Or start individual services
pnpm --filter @financial/offers-service dev
pnpm --filter @financial/orders-service dev
pnpm --filter @financial/delivery-notes-service dev
pnpm --filter @financial/invoices-service dev
```

### 4. Verify Setup

Check that all services are running:

```bash
# Health check all services
curl http://localhost:3001/health  # Offers
curl http://localhost:3002/health  # Orders
curl http://localhost:3003/health  # Delivery Notes
curl http://localhost:3004/health  # Invoices
curl http://localhost:3005/health  # Audit
```

## Docker Deployment

### Build Images

Build Docker images for all services:

```bash
# Build all images
pnpm docker:build

# Build specific service
docker build -f apps/offers-service/Dockerfile -t financial/offers-service:latest .
```

### Docker Compose

Use Docker Compose for multi-service deployment:

```bash
# Start all services
docker-compose up -d

# Scale specific service
docker-compose up -d --scale offers-service=3

# View logs
docker-compose logs -f offers-service

# Stop all services
docker-compose down
```

## Kubernetes Deployment

### 1. Prepare Kubernetes Cluster

Ensure your Kubernetes cluster is ready:

```bash
# Check cluster status
kubectl cluster-info

# Create namespace
kubectl create namespace financial-services

# Set default namespace
kubectl config set-context --current --namespace=financial-services
```

### 2. Deploy Infrastructure

Deploy required infrastructure components:

```bash
# Deploy PostgreSQL
kubectl apply -f k8s/infrastructure/postgresql.yaml

# Deploy Redis
kubectl apply -f k8s/infrastructure/redis.yaml

# Deploy RabbitMQ
kubectl apply -f k8s/infrastructure/rabbitmq.yaml
```

### 3. Deploy Services

Deploy all microservices:

```bash
# Deploy all services
kubectl apply -f k8s/services/

# Or deploy individual services
kubectl apply -f k8s/services/offers-service.yaml
kubectl apply -f k8s/services/orders-service.yaml
kubectl apply -f k8s/services/delivery-notes-service.yaml
kubectl apply -f k8s/services/invoices-service.yaml
kubectl apply -f k8s/services/audit-service.yaml
```

### 4. Deploy Ingress

Configure ingress for external access:

```bash
# Deploy ingress controller (nginx)
kubectl apply -f https://raw.githubusercontent.com/kubernetes/ingress-nginx/controller-v1.8.2/deploy/static/provider/cloud/deploy.yaml

# Deploy ingress rules
kubectl apply -f k8s/ingress/ingress.yaml
```

### 5. Verify Deployment

Check deployment status:

```bash
# Check pods
kubectl get pods

# Check services
kubectl get services

# Check ingress
kubectl get ingress

# View logs
kubectl logs -f deployment/offers-service
```

## OpenShift Deployment

### 1. Create Project

```bash
# Login to OpenShift
oc login https://openshift.example.com

# Create project
oc new-project financial-services

# Or use existing project
oc project financial-services
```

### 2. Deploy with Helm

Use Helm charts for OpenShift deployment:

```bash
# Add Helm repository
helm repo add financial https://charts.financial.com
helm repo update

# Install all services
helm install financial-services financial/financial-services \
  --namespace financial-services \
  --set global.openshift=true \
  --set global.ingressClass=openshift-default
```

### 3. Configure Routes

OpenShift uses Routes instead of Ingress:

```bash
# Create routes
oc apply -f k8s/openshift/routes.yaml

# Expose services
oc expose service offers-service
oc expose service orders-service
oc expose service delivery-notes-service
oc expose service invoices-service
```

## Environment Configuration

### Development Environment

```yaml
# .env.development
NODE_ENV=development
LOG_LEVEL=debug
DATABASE_URL=postgresql://user:pass@localhost:5432/financial_offers
REDIS_URL=redis://localhost:6379
RABBITMQ_URL=amqp://localhost:5672
JWT_SECRET=dev-secret-key
API_RATE_LIMIT=1000
```

### Staging Environment

```yaml
# .env.staging
NODE_ENV=staging
LOG_LEVEL=info
DATABASE_URL=postgresql://user:pass@staging-db:5432/financial_offers
REDIS_URL=redis://staging-redis:6379
RABBITMQ_URL=amqp://staging-rabbitmq:5672
JWT_SECRET=staging-secret-key
API_RATE_LIMIT=500
```

### Production Environment

```yaml
# .env.production
NODE_ENV=production
LOG_LEVEL=warn
DATABASE_URL=postgresql://user:pass@prod-db:5432/financial_offers
REDIS_URL=redis://prod-redis:6379
RABBITMQ_URL=amqp://prod-rabbitmq:5672
JWT_SECRET=production-secret-key
API_RATE_LIMIT=100
```

## Monitoring Setup

### 1. Prometheus Configuration

Deploy Prometheus for metrics collection:

```bash
# Deploy Prometheus
kubectl apply -f k8s/monitoring/prometheus.yaml

# Verify deployment
kubectl get pods -l app=prometheus
```

### 2. Grafana Dashboard

Deploy Grafana for visualization:

```bash
# Deploy Grafana
kubectl apply -f k8s/monitoring/grafana.yaml

# Import dashboards
kubectl exec -it grafana-pod -- grafana-cli admin reset-admin-password admin123
```

### 3. Alerting Rules

Configure alerting for critical metrics:

```yaml
# prometheus-alerts.yaml
groups:
- name: financial-services
  rules:
  - alert: HighErrorRate
    expr: rate(http_requests_total{status=~"5.."}[5m]) > 0.1
    for: 5m
    labels:
      severity: critical
    annotations:
      summary: "High error rate detected"
      description: "Error rate is {{ $value }} errors per second"
```

## Security Configuration

### 1. Network Policies

Implement network segmentation:

```yaml
# network-policy.yaml
apiVersion: networking.k8s.io/v1
kind: NetworkPolicy
metadata:
  name: financial-services-policy
spec:
  podSelector:
    matchLabels:
      app: financial-services
  policyTypes:
  - Ingress
  - Egress
  ingress:
  - from:
    - namespaceSelector:
        matchLabels:
          name: api-gateway
    ports:
    - protocol: TCP
      port: 3000
```

### 2. Secrets Management

Store sensitive data in Kubernetes secrets:

```bash
# Create secrets
kubectl create secret generic db-credentials \
  --from-literal=username=dbuser \
  --from-literal=password=dbpass

kubectl create secret generic jwt-secret \
  --from-literal=secret=jwt-secret-key

kubectl create secret generic api-keys \
  --from-literal=external-api-key=key123
```

### 3. RBAC Configuration

Configure role-based access control:

```yaml
# rbac.yaml
apiVersion: rbac.authorization.k8s.io/v1
kind: Role
metadata:
  name: financial-services-role
rules:
- apiGroups: [""]
  resources: ["pods", "services"]
  verbs: ["get", "list", "watch"]
```

## Backup and Recovery

### 1. Database Backup

Set up automated database backups:

```bash
# Create backup job
kubectl apply -f k8s/backup/postgres-backup.yaml

# Manual backup
kubectl exec postgres-pod -- pg_dump -U postgres financial_offers > backup.sql
```

### 2. Configuration Backup

Backup Kubernetes configurations:

```bash
# Backup all configurations
kubectl get all -o yaml > k8s-backup.yaml

# Backup secrets (encrypted)
kubectl get secrets -o yaml > secrets-backup.yaml
```

## Troubleshooting

### Common Issues

1. **Service Not Starting**
   ```bash
   # Check pod logs
   kubectl logs pod-name
   
   # Check pod status
   kubectl describe pod pod-name
   ```

2. **Database Connection Issues**
   ```bash
   # Check database connectivity
   kubectl exec pod-name -- nc -zv postgres-service 5432
   
   # Check database logs
   kubectl logs postgres-pod
   ```

3. **Message Queue Issues**
   ```bash
   # Check RabbitMQ status
   kubectl exec rabbitmq-pod -- rabbitmqctl status
   
   # Check queue status
   kubectl exec rabbitmq-pod -- rabbitmqctl list_queues
   ```

### Performance Tuning

1. **Resource Limits**
   ```yaml
   resources:
     requests:
       memory: "256Mi"
       cpu: "250m"
     limits:
       memory: "512Mi"
       cpu: "500m"
   ```

2. **Horizontal Pod Autoscaling**
   ```yaml
   apiVersion: autoscaling/v2
   kind: HorizontalPodAutoscaler
   metadata:
     name: offers-service-hpa
   spec:
     scaleTargetRef:
       apiVersion: apps/v1
       kind: Deployment
       name: offers-service
     minReplicas: 2
     maxReplicas: 10
     metrics:
     - type: Resource
       resource:
         name: cpu
         target:
           type: Utilization
           averageUtilization: 70
   ```

## Rollback Procedures

### Application Rollback

```bash
# Rollback deployment
kubectl rollout undo deployment/offers-service

# Rollback to specific revision
kubectl rollout undo deployment/offers-service --to-revision=2

# Check rollout status
kubectl rollout status deployment/offers-service
```

### Database Rollback

```bash
# Restore from backup
kubectl exec postgres-pod -- psql -U postgres -d financial_offers < backup.sql

# Run specific migration rollback
kubectl exec pod-name -- npx prisma migrate reset
```
