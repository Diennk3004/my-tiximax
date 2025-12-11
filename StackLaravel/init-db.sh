#!/bin/sh
psql    -U root     -p 5432     -c "CREATE DATABASE tiximax"
psql    -U root     -p 5432     -d tiximax    <   ../DatabaseBackup/tiximax-20251211-00h23.tar.gz

