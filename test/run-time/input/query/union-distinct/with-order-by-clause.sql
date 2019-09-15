SELECT
  *
FROM
  (
    SELECT
      "myTable"."myBoolColumn" AS "myTable--myBoolColumn",
      "myTable"."myDoubleColumn" AS "myTable--myDoubleColumn"
    FROM
      "myTable"
    ORDER BY
      "myTable"."myDoubleColumn" DESC
  )
UNION
SELECT
  ("myTable2"."someOtherColumn" > 0.4) AS "__aliased--gt",
  "myTable2"."someOtherColumn" AS "myTable2--someOtherColumn"
FROM
  "myTable2"