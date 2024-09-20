## Setting Up Containers

### Creating a local registry

A local container registry is a service where Docker images are stored , managed and retrieved . Setting up a local registry is useful for development environments or private images .

```bash
docker run -d -p 5000:5000 --name local-registry registry:2
```

### Now Building and Tagging the backend-flask

```bash
# changing to dockerfile directory
cd backend/

# build the docker file
docker build -t backend-flask .

# tagging the docker image
docker tag backend-flask:latest localhost:5000/backend-flask:latest
```

### Pushing the backend image to local registry

```bash
docker push localhost:5000/backend-flask:latest
```

### Similarly Building and tagging Frontend-react

```bash
# changing to frontend directory
cd frontend/

# build the frontend image
docker build -t frontend-react .

# tagging the image
docker tag frontend-react:latest localhost:5000/frontend-react:latest

# Push the Image on the registry
docker push localhost:5000/frontend-react:latest
```

## Setting up Deployments and Services

### Setting up Deployment for Backend-flask pod

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: backend-flask
  namespace: app
spec:
  replicas: 1
  selector:
    matchLabels:
      app: backend-flask
  template:
    metadata:
      labels:
        app: backend-flask
    spec:
      nodeName: controlplane
      containers:
        - name: backend-flask
          image: localhost:5000/backend-flask:latest
          ports:
            - containerPort: 6000
```

### Creating clusterIP service to expose the Backend-flask

The service are the abstractions that define how to application running as a set of pods. They ensure reliable communication by grouping pods under a commonn network endpoints.

```yaml
apiVersion: v1
kind: Service
metadata:
  name: backend-service
spec:
  selector:
    app: backend
  ports:
    - protocol: TCP
      port: 6000
      targetPort: 6000
  type: ClusterIP
```

### Setting up deployment for frontend-react

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: frontend
  namespace: app
spec:
  replicas: 2
  selector:
    matchLabels:
      app: frontend
  template:
    metadata:
      labels:
        app: frontend
    spec:
      containers:
        - name: frontend
          image: localhost:5000/frontend-react:latest
          ports:
            - containerPort: 80
          env:
            - name: REACT_APP_BACKEND_URL
              value: "http://backend-service.app.svc.cluster.local:6000"
```

### setting up LoadBalancer service to expose frontend externally

```yaml
apiVersion: v1
kind: Service
metadata:
  name: frontend-service
  namespace: app
spec:
  selector:
    app: frontend
  ports:
    - protocol: TCP
      port: 80
      targetPort: 80
  type: LoadBalancer
```
