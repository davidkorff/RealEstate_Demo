@echo off
echo Creating database and tables...
psql -U postgres -c "DROP DATABASE IF EXISTS housing_complex;"
psql -U postgres -c "CREATE DATABASE housing_complex;"
psql -U postgres -d housing_complex -f db/init.sql
echo Database initialization complete! 