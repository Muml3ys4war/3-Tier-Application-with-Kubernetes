## Troubleshooting And Verification Steps for Kubernetes

### Check for Pod status

```bash
kubectl get pods -n <namespace>
```

Ensure all the pods are in running state

- Pods in **Error** or **CrashLoopBackOff** state indicate startup issues
- Pods in **Pending** state might be waiting for resources or persistent volumes

### Check Pod Logs

```bash
# kubectl logs
kubectl logs <pod_name> -n <namespace>

# node logs
cat /var/log/pods/<instance_name>
```

- check for error messages or failure logs
- look for startup errors , especially for databases

### Check for Persistent Volume (PV) and Persistent Volume Claim (PVC)

```bash
kubectl get pvc -n <namespace>
```

- if the PVC is not **Bound** , check the storage class , access modes and volume size.
- Execute into the pod and check if volume is mounted.

```bash
kubectl exec -it <pod_name> -n <namespace> -- /bin/sh
```

- navigate to mounted directory and check write access .

### Test Network Connectivity Between Pods

```bash
# eg between backend - mongodb
kubectl exec -it <backend_pod_name> -n <namespace> -- /bin/sh

# send a http request
curl http://<database_service_name>.<namespace>.svc.cluster.local:<port>
```

- if connection fails , check network policies or service configuration
- use telnet or nc to verify open ports

### Verify Readiness Probes

check readiness/liveness probes to ensure services are properly starting

```bash
kubectl describe pod <pod_name> -n <namespace>
```

### Verify Service Endpoints

```bash
kubectl get svc -n namespace
```

- verify the service types and endpoints.
- Test the backend service Url using DNS or the service IP.

### Test LoadBalancer/NodePort Accessibility

if using **LoadBalancer** or **NodePort** , test external accessibility

- ensure firewalls/security group allow access to external ports

```bash
curl http://<node_ip>:<node_port/
```
