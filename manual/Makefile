CHAPTERS = intro.xml playlists.xml live.xml editing.xml
PDFCHAPTERS = $(CHAPTERS:.xml=.pdf)
FO_STYLESHEET = docbook.xsl
HTML_STYLESHEET = /sw/share/xml/xsl/docbook-xsl/xhtml/chunk.xsl
MANIFEST = Makefile $(CHAPTERS) bookmaker
FOP = /Users/simon/svn/fop/fop -c /Users/simon/svn/fop/conf/fop.xconf 

.SUFFIXES:
.SUFFIXES: .xml .fo .pdf
#
.fo.pdf:
	$(FOP) $< $@

.xml.fo:
	xsltproc $(FO_STYLESHEET) $< > $@

all: book.pdf book-ja.pdf htmlbook

dist: 
	tar czvf book.tar.gz $(MANIFEST)

pdfdist: pdfchapters
	tar czvf pdfs.tar.gz $(PDFCHAPTERS)

htmlbook:
	xsltproc -stringparam base.dir html/ $(HTML_STYLESHEET) book.xml

pdfchapters: $(PDFCHAPTERS)

book.xml: $(CHAPTERS)
	perl bookmaker

book.fo: book-en.xml
	xsltproc $(FO_STYLESHEET) book-en.xml > book.fo

book-en.xml: book.xml
	xsltproc select-language.xsl book.xml > book-en.xml

book-ja.xml: book.xml
	xsltproc --stringparam Lang "ja" select-language.xsl book.xml > book-ja.xml
