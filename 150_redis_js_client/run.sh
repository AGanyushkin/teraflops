# https://hub.docker.com/_/redis/

docker run --name test-redis -p 6379:6379 -d redis
docker stop test-redis
docker rm test-redis
