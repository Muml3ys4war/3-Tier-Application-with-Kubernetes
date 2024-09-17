# Setting Up

### Creating namespace

Check and then setup namespace for application.

```bash
# Get Current Namespaces
kubectl get ns

# Ceate Required Namespace
kubectl create namespace app
kubectl create namespace data

# Check for Namespace
kubectl get ns
```

### Create a Secret to use with Mongodb

```bash
# create secret
kubectl create secret generic mongodb
--from-literal=mongo_root="SuperSecurePassword" -n data

# check for secret
kubectl get secrets -n data
```

### Setting up Storage

Creating Persistent Volume and Persistent volume Claim .

storage.yaml

```yaml
apiVersion: v1
kind: PersistentVolume
metadata:
  name: mongodb-pv
  namespace: data
  labels: type:local
spec:
  storageClassName: manual
  capacity:
    storage: 5Gi
  accessModes:
    - ReadWriteOnce
  hostPath:
    path: /data/mongodb
---
apiVersion: v1
kind: PersistentVolumeClaim
metadata:
  name: mongodb-pvc
  namespace: data
spec:
  storageClassName: manual
  accessModes:
    - ReadWriteOnce
  resources:
    requests:
      storage: 5Gi
```

```bash
# create the persistent volume and persistent volume claim
kubectl create -f storage.yaml

# check for pv and pvc
kubectl get pv
kubectl get pvc -n data
```

### Create Mongodb Deployment and Service

```yaml
apiVersion: v1
kind: Service
metadata:
  name: mongodb-service
  namespace: data
spec:
  selector:
    app: mongodb
  ports:
    - protocol: TCP
      port: 27017
      targetPort: 27017
  type: None

---
apiVersion: apps/v1
kind: Deployment
metadata:
  name: mongodb
  namespace: data
spec:
  replicas: 1
  selector:
    matchLabels:
      app: mongodb
  template:
    metadata:
      labels:
        app: mongodb
    spec:
      containers:
        - name: mongodb
          image: mongo:4.4
          ports:
            - containerPort: 27017
              name: mongod
          env:
            - name: MONGO_INITDB_ROOT_PASSWORD
              valueFrom:
                secretKeyRef:
                  name: mongodb
                  key: mongodb-root-password
          volumeMounts:
            - name: mongodb-storage
              mountPath: /data/db
      volumes:
        - name: mongodb-storage
          persistentVolumeClaim:
            claimName: mongodb-pvc
```

```bash
# create the deployment and service file
kubectl create -f mongo.yaml

# checking for resources which were created
kubectl get svc -n data
kubectl describe svc mongodb-service -n data

# checking for deployments
kubectl get deployments -n data
kubectl get pods -o wide -n data --show-labels
```
