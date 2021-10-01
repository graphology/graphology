MINIVAN=~/code/minivan/app
OLD=$MINIVAN/olddata
NEW=$MINIVAN/data

node scripts/convert-alpha.js $OLD/test00.json > $NEW/test00.json
node scripts/convert-alpha.js $OLD/test01.json > $NEW/test01.json
node scripts/convert-alpha.js $OLD/test02.json > $NEW/test02.json
node scripts/convert-alpha.js $OLD/test03.json > $NEW/test03.json

cp $NEW/test01.json test/resources/nordic-design.json
cp $NEW/test02.json test/resources/data-school-edge-attributes.json
