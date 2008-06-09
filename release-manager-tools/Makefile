VERSION = 1.1
SCRATCHDIR = /tmp/songbee-dist/
PRISTINE = /tmp/songbee-pristine/
RELEASEDIR = /tmp/songbee-releases/

checklist:
	@echo "Have you updated the version in this Makefile?"
	@echo "Have you updated README.unix?"
	@echo "Have you rebuilt the manual PDF? (And updated the manual!)"
	@echo "Have you checked the xulrunner version in install.sh?"
	@echo "Have you checked all your changes into SVN?"
	cd ..; svn status
	@echo "If so, then you can make release."

release : release-osx release-win release-unix

release-win : checkout-pristine create-clean-dist get-xulrunner add-icon make-installer

release-unix : checkout-pristine create-clean-dist zip-dist
	cd $(SCRATCHDIR)
	mkdir songbee-$(VERSION)
	mv songbee.zip songbee-$(VERSION)
	cp $(PRISTINE)/release-manager-tools/README.unix songbee-$(VERSION)/README
	cp $(PRISTINE)/manual/book.pdf songbee-$(VERSION)/manual.pdf
	cp $(PRISTINE)/release-manager-tools/install.sh songbee-$(VERSION)
	tar czvf $(RELEASEDIR)/songbee-$(VERSION).tar.gz songbee-$(VERSION)	

checkout-pristine :
	rm -rf $(PRISTINE)
	cd $(PRISTINE)
	svn co http://svn.simon-cozens.org/songbee 
	mv songbee/* .
	rm -rf songbee

create-clean-dist:
	rm -rf $(SCRATCHDIR)
	cp -ar $(PRISTINE) $(SCRATCHDIR)
	rm -rf Songbee.icns release-manager-tools **/svn-commit* **/.svn songs manual load.pl

zip-dist:
	cd $(SCRATCHDIR)
	zip -r songbee.zip *

get-xulrunner:
	cd $(SCRATCHDIR)
	wget http://ftp.mozilla.org/pub/mozilla.org/xulrunner/nightly/latest-trunk/xulrunner-1.9pre.en-US.win32.zip
	unzip xulrunner-1.9pre.en-US.win32.zip
	rm xulrunner-1.9a2pre.en-US.win32.zip 
	mv xulrunner/xulrunner-stub.exe songbee.exe

add-icon: 
	cd $(SCRATCHDIR)
	convert $(SCRATCHDIR)/chrome/songbee/songbee.png $(SCRATCHDIR)/songbee.ico
	exe_update.pl --icon songbee.ico songbee.exe

make-installer: 
	cd $(SCRATCHDIR)
	perl $(PRISTINE)/release-manager-tools/write-nsi.pl $(VERSION) > songbee.nsi
	makensis songbee.nsi
	cp SongbeeSetup.exe $(RELEASEDIR)/SongbeeSetup-$(VERSION).exe
