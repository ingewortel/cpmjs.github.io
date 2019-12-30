includelist=$1

moduledependencies=$(cat $includelist | awk '$1 ~ /^module/{printf "%s ", $3}' )

echo ".SECONDARY:"
echo ".DELETE_ON_ERROR:"
echo "all : uptodate"
echo -e "\n"

echo "uptodate :  "$moduledependencies
echo -e "\t" @touch \$@

