#!/bin/sh
psql    -U root     -p 5432     -c "CREATE DATABASE tiximax"
psql    -U root     -p 5432     -d tiximax    <   ../DatabaseBackup/env.local.tiximax-20251214-23h40.tar.gz

