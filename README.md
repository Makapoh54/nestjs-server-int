## Running
To run execute docker compose up -d, open http://127.0.0.1:3000/api#/

## Api
transaction-remote is mock of remote transactions service, it is filled by migrations with random transactions

transactions-local is local service, which syncs transactions from remote using date cursor and cron schedule. It exposes two apis which allows to retrieve per user balance and total payouts

## Unfinished
1. Tests missing
2. Local service requires pagination and should be split to 2 separate services sync and aggregate
3. Aggregation results should be stored in cache
4. Schedule sync is suboptimal and does not query by 2 minutes window required
5. Api versioning missing
6. Numbers not rounded to 2 decimal
7. Data structures has small differences
8. Remote and local can be split onto two separate services in docker compose and combined by monorepo
9. Some hardcode here and there
