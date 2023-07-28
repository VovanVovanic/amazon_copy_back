with init as (SELECT 
product_id,
CAST(ROUND(AVG(rating)) AS DEC(10,0)) as "average"
FROM public."Product" as p
JOIN "Review" as r on r.product_id = p.id
GROUP BY
    product_id)


UPDATE public."Product"
SET average_rating = i.average
FROM  init as i, public."Product" as p
WHERE public."Product".id = product_id