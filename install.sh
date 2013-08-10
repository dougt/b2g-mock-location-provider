rm -f components/components.manifest
rm -f omni.ja

adb pull /system/b2g/omni.ja .

zip -g omni.ja components/MockGeolocationProvider.js
unzip -p omni.ja  components/components.manifest > components/components.manifest

cat components/MockGeolocationProvider.manifest >> components/components.manifest
zip -g omni.ja components/components.manifest

adb remount
adb push omni.ja /system/b2g/
adb reboot
