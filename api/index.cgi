#!/bin/bash
echo "Content-type: text/html"
echo ""


# Writing get params to variables
PARAMS=(${QUERY_STRING//&/ })
ARR_LEN=$((${#PARAMS[@]} - 1))
i=0
while [[ $i -le ARR_LEN ]]
do
    PARAM=${PARAMS["$i"]}
    SPLITTED=(${PARAM//=/ })
    declare ${SPLITTED[0]}=${SPLITTED[1]}
    ((i = i + 1))
done


if [ -n "$GET" ]; then
sqlite3  /var/media/ftp/uStor01/psa.db  "SELECT release_part_name, links FROM release WHERE release_name LIKE '$GET';"
exit 0
fi


if [ -n "$ADD" ]; then
CREATED=$(date +%s)
sqlite3  /var/media/ftp/uStor01/psa.db "INSERT INTO release (page_url, release_name, release_part_name, created, links) VALUES('$URL', '$ADD', '$PARTNAME', '$CREATED', '$LINKS');"
echo "OK"
fi


