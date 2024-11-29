## Generate RSA keys

```bash
openssl genpkey -algorithm RSA -out private.key

openssl rsa -pubout -in private.key -out public.key
```

## Elastisearch in Docker

```bash
docker run -p 127.0.0.1:9200:9200 -p 127.0.0.1:9300:9300 -e "discovery.type=single-node" elastic/elasticsearch:8.15.5
```
