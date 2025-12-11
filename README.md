<p><strong>Fullname:</strong> Nguyễn Kim Điền</p>
<strong>Position:</strong> Fullstack developer
Example test: Permission management
Techstack: ReactJs + Laravel
Source code: https://github.com/Diennk3004/MyTiximax

Step 1: git clone git@github.com:Diennk3004/MyTiximax.git

Step 2: Run command line below
docker compose -p env_production_my_tiximax down && docker image prune -a -f && docker builder prune -a -f && docker compose -p env_production_my_tiximax -f docker-compose.env.production.yaml up -d && docker exec postgres_env_production_tiximax sh -c "psql -U root -tc \"select 1 from pg_database where datname='tiximax'\" | grep -q 1 || psql -U root -c \"create database tiximax\"" && docker exec postgres_env_production_tiximax sh -c "psql -h 0.0.0.0 -p 5432 -U root -d tiximax < ./DatabaseBackup/tiximax-20251211-00h23.tar.gz"

Step 3: Access http://localhost:2512

Step 4: Data
User1: diennk - 246357
User2: hongnt - 246357
User3: dungtd - 246357
