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


python switch.py $device $state