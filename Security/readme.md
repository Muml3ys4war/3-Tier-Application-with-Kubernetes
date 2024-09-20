## Using Network Policies

Network Policy defines how Pods communicate with each other and with external service , allowing you to control inbound and outbound traffic at the Pod level . By default , all traffic is allowed between Pods in a cluster , but network policies enable fine-grained control over these connections based on pod Labels , namespaces and traffic types ( ingress / egress ).

This ensures enhanced security by limiting communication only to necessary services and reducing exposure to potential threats within the cluster.

![Logical Overview](/Security/policies.png)

### Setting Up default Deny Policy _( Recommended )_

```yaml
apiVersion: networking.k8s.io/v1
kind: NetworkPolicy
metadata:
  name: default-deny-egress
  namespace: app
spec:
  podSelector: {}
  policyTypes:
    - Egress
```

### Setting Up Policies between backend-flask and MongoDB

```yaml
apiVersion: networking.k8s.io/v1
kind: NetworkPolicy
metadata:
  name: mongodb-backend
  namespace: data
spec:
  podSelector:
    matchLabels:
      app: mongodb
  policyTypes:
    - Ingress
  ingress:
    - from:
        - podSelector:
            matchLabels:
              app: backend-flask
      ports:
        - protocol: TCP
          port: 27017
```

### Setting Up Network Policies Between Frontend-react and Backend-flask

```yaml
apiVersion: networking.k8s.io/v1
kind: NetworkPolicy
metadata:
  name: allow-frontend-to-backend
  namespace: app
spec:
  podSelector:
    matchLabels:
      app: backend-flask
  policyTypes:
    - Ingress
    - Egress
  ingress:
    - from:
        - podSelector:
            matchLabels:
              app: frontend-react
      ports:
        - protocol: TCP
          port: 6000
  egress:
    - to:
        - podSelector:
            matchLabels:
              app: frontend
        - podSelector:
            matchLabels:
              app: mongodb
          namespaceSelector:
            matchLabels:
              name: data
      ports:
        - protocol: TCP
          port: 80 # Assuming frontend uses port 80
        - protocol: TCP
          port: 27017 # MongoDB's default port
```

#### Creating Resources

```bash
kubectl create -f default-deny.yaml
kubectl create -f front-back.yaml
kubectl create -f mongo-backend.yaml
```
