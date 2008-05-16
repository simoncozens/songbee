[ -e Songbee.mpkg ] || echo "You're in the wrong directory!";
[ -e Songbee.mpkg/Contents/Packages/songbee.pkg ] || echo "Can't find the songbee package";
[ -e Songbee.mpkg/Contents/Packages/xulrunner.pkg ] || echo "Can't find the xulrunner package";
rm -rf dist
mkdir dist
hdiutil create dist/$1.dmg -size 13m -fs HFS+ -volname "Songbee"
dev_handle=`hdid dist/$1.dmg | grep Apple_HFS | perl -e '\$_=<>; /^\\/dev\\/(disk.)/; print \$1'`
ditto -rsrcFork "Songbee.mpkg" "/Volumes/Songbee/Songbee.mpkg"
ditto -rsrcFork Songbee-Volume.icns "/Volumes/Songbee/.VolumeIcon.icns"
/Developer/Tools/SetFile -a C "/Volumes/Songbee/"
hdiutil detach $dev_handle
hdiutil convert dist/$1.dmg -format UDZO -o dist/$1.udzo.dmg
rm -f dist/$1.dmg
mv dist/$1.udzo.dmg dist/$1.dmg
