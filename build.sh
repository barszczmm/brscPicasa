#!/bin/bash

ver="1.2"
name="brscPicasa"
build=$name-$ver
info="// brscPicasa v"$ver" - jQuery plugin for displaying photos from Google Picasa Web Albums.\n// c) 2010-2012 Maciej 'barszcz' Marczewski - www.barszcz.info - maciej@marczewski.net.pl\n// Licensed under the MIT license: http://www.opensource.org/licenses/mit-license.php"

#minify
java -jar yuicompressor-2.4.2.jar -o jquery.$name.min.js jquery.$name.js

#create build dir
cd builds
if [ -d "$build" ]; then
	rm -r $build
fi
mkdir $build

# create script (with info string)
echo -e $info > $build/jquery.$build.js
cat ../jquery.$name.js >> $build/jquery.$build.js
# create minified script (with info string)
echo -e $info > $build/jquery.$build.min.js
cat ../jquery.$name.min.js >> $build/jquery.$build.min.js

# copy README file
cp ../README $build/

# copy demo dir into build
cp ../demo $build/ -r
# remove symlink from demo
rm $build/demo/scripts/jquery.$name.js
# copy script to demo dir
cp $build/jquery.$build.js $build/demo/scripts/jquery.$name.js

# zip build
zip -r ../downloads/$build.zip $build
cp ../downloads/$build.zip ../downloads/$name-latest.zip