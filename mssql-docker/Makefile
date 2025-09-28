#
# REFERENCE:
# 	https://learn.microsoft.com/en-us/sql/linux/quickstart-install-connect-docker?view=sql-server-linux-ver15&preserve-view=true&tabs=cli&pivots=cs1-bash#pullandrun2019
#

.PHONY: pull up upd reup logs mssqlshell rootbash

# pull image
pull:
	docker pull mcr.microsoft.com/mssql/server:2019-latest

# bring up container
upd:
	docker run -e "ACCEPT_EULA=Y" -e "MSSQL_SA_PASSWORD=SAP@ssW0rd" -p 1433:1433 --name sql1 --hostname sql1 -d mcr.microsoft.com/mssql/server:2019-latest

# bring up container
up:
	docker run -e "ACCEPT_EULA=Y" -e "MSSQL_SA_PASSWORD=SAP@ssW0rd" -p 1433:1433 --name sql1 --hostname sql1 mcr.microsoft.com/mssql/server:2019-latest

# reup container
reup:
	docker start sql1

# get logs
logs:
	docker exec -t sql1 cat /var/opt/mssql/log/errorlog | grep connection

# sql1 mssql shell
# to connect to db:
# 	/opt/mssql-tools18/bin/sqlcmd -S localhost -U sa -P "SAP@ssW0rd" -C
mssqlshell:
	docker exec -it sql1 "bash"

# bash
rootbash:
	docker exec -u 0 -it sql1 /bin/bash
