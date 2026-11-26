-- Numeração dos pedidos começa em 200 (só avança o contador; pedidos existentes não mudam).
SELECT setval('orders_id_seq', GREATEST(199, (SELECT COALESCE(MAX(id), 0) FROM orders)));
