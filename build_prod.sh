echo "removing existing dist"
yarn install
rm -rf .next

OUT_FOLDER=out
if test -d "$OUT_FOLDER" ; then
   rm -rf out
fi
DIST_FOLDER=dist
if test -d "$DIST_FOLDER" ; then
   rm -rf dist
fi
FILE=dist.zip
if test -f "$FILE"; then
   rm dist.zip 
fi
echo "building stage build"
yarn build
mkdir dist

mkdir ./dist/public
mv ./out/* ./dist

cp -r ./public/* ./dist/public/



zip -r dist.zip dist
rm -rf dist
rm -rf out
rm -rf .next
echo "copying stage build to stage"
scp -i ~/pem-files/sensa_prod.pem -r dist.zip ubuntu@ec2-44-196-14-226.compute-1.amazonaws.com:/home/ubuntu/shipped/.
rm -rf dist.zip
echo "done"%





