CHAPTERS = intro.xml playlists.xml live.xml editing.xml
PDFCHAPTERS = $(CHAPTERS:.xml=.pdf)
FO_STYLESHEET = /sw/share/xml/xsl/docbook-xsl/fo/docbook.xsl
HTML_STYLESHEET = /sw/share/xml/xsl/docbook-xsl/xhtml/chunk.xsl
MANIFEST = Makefile $(CHAPTERS) bookmaker
FOP = /Users/simon/Desktop/trunk/fop

.SUFFIXES:
.SUFFIXES: .xml .fo .pdf
#
.fo.pdf:
	$(FOP) $< $@

.xml.fo:
	xsltproc $(FO_STYLESHEET) $< > $@

all: book.pdf htmlbook

dist: 
	tar czvf book.tar.gz $(MANIFEST)

pdfdist: pdfchapters
	tar czvf pdfs.tar.gz $(PDFCHAPTERS)

htmlbook:
	xsltproc -stringparam base.dir html/ $(HTML_STYLESHEET) book.xml

pdfchapters: $(PDFCHAPTERS)

book.xml: $(CHAPTERS)
	perl bookmaker

book.fo: book.xml
	xsltproc $(FO_STYLESHEET) book.xml > book.fo

latexpdf: book.fo
	 pdflatex "&pdfxmltex" book.fo ; pdflatex "&pdfxmltex" book.fo

latexdvi: book.fo
	 latex "&xmltex" book.fo ; latex "&xmltex" book.fo
