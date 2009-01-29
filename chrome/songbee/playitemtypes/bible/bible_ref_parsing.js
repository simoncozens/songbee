// 
// This code was written by Jason Wall.  Feel free to use, and if you can, include a link back to www.walljm.com
// Jason@walljm.com // www.walljm.com
//


function Reference(bibleRef) {
	bibleRef = bibleRef.toLowerCase();
	var bibleNames = new Object;
	var book = bibleRef.substring(0, bibleRef.search(/\s\d/i));
	
	if (book.search(/\b(genesis|gen|ge|gn)\b/i) != -1) {
		this.book = 1;
		this.bookname = "Genesis";
		this.longbookname = "Genesis";
		this.lastchapter = 50;
	}
	if (book.search(/\b(exodus|ex|exo|exod|exd)\b/i) != -1) {
		this.book = 2;
		this.bookname = "Exodus";
		this.longbookname = "Exodus";
		this.lastchapter = 40;
	}
	if (book.search(/\b(leviticus|lev|le|levi|lv)\b/i) != -1) {
		this.book = 3;
		this.bookname = "Leviticus";
		this.longbookname = "Leviticus";
		this.lastchapter = 27;
	}
	if (book.search(/\b(numbers|num|nu|numb|number)\b/i) != -1) {
		this.book = 4;
		this.bookname = "Numbers";
		this.longbookname = "Book_of_Numbers";
		this.lastchapter = 36;
	}
	if (book.search(/\b(deuteronomy|deut|de|dt|deu)\b/i) != -1) {
		this.book = 5;
		this.bookname = "Deuteronomy";
		this.longbookname = "Deuteronomy";
		this.lastchapter = 34;
	}
	if (book.search(/\b(joshua|josh|jos)\b/i) != -1) {
		this.book = 6;
		this.bookname = "Joshua";
		this.longbookname = "Book_of_Joshua";
		this.lastchapter = 24;
	}
	if (book.search(/\b(judges|jud|ju|jdg|judg)\b/i) != -1) {
		this.book = 7;
		this.bookname = "Judges";
		this.longbookname = "Book_of_Judges";
		this.lastchapter = 21;
	}
	if (book.search(/\b(ruth|ru)\b/i) != -1) {
		this.book = 8;
		this.bookname = "Ruth";
		this.longbookname = "Book_of_Ruth";
		this.lastchapter = 4;
	}
	if (book.search(/\b(1|i|1st|first)\s*(samuel|sa|sam|sml)\b/i) != -1) {
		this.book = 9;
		this.bookname = "1 Samuel";
		this.longbookname = "First_Samuel";
		this.lastchapter = 31;
	}
	if (book.search(/\b(2|ii|2nd|second|sec)\s*(samuel|sa|sam|sml)\b/i) != -1) {
		this.book = 10;
		this.bookname = "2 Samuel";
		this.longbookname = "Second_Samuel";
		this.lastchapter = 24;
	}
	if (book.search(/\b(1|i|1st|first)\s*(kings|king|kgs|kn|k|ki)\b/i) != -1) {
		this.book = 11;
		this.bookname = "1 Kings";
		this.longbookname = "First_Kings";
		this.lastchapter = 22;
	}
	if (book.search(/\b(2|ii|2nd|second|sec)\s*(kings|king|kgs|kn|k|ki)\b/i) != -1) {
		this.book = 12;
		this.bookname = "2 Kings";
		this.longbookname = "Second_Kings";
		this.lastchapter = 25;
	}
	if (book.search(/\b(1|i|1st|first)\s*(chronicles|chron|ch|chr)\b/i) != -1) {
		this.book = 13;
		this.bookname = "1 Chronicles";
		this.longbookname = "First_Chronicles";
		this.lastchapter = 29;
	}
	if (book.search(/\b(2|ii|2nd|second|sec)\s*(chronicles|chron|ch|chr)\b/i) != -1) {
		this.book = 14;
		this.bookname = "2 Chronicles";
		this.longbookname = "Second_Chronicles";
		this.lastchapter = 36;
	}
	if (book.search(/\b(ezra|ez|ezr)\b/i) != -1) {
		this.book = 15;
		this.bookname = "Ezra";
		this.longbookname = "Book_of_Ezra";
		this.lastchapter = 10;
	}
	if (book.search(/\b(nehemiah|neh|ne|nehamiah)\b/i) != -1) {
		this.book = 16;
		this.bookname = "Nehemiah";
		this.longbookname = "Book_of_Nehemiah";
		this.lastchapter = 13;
	}
	if (book.search(/\b(esther|est|es|esth)\b/i) != -1) {
		this.book = 17;
		this.bookname = "Esther";
		this.longbookname = "Book_of_Esther";
		this.lastchapter = 10;
	}
		if (book.search(/\b(job|jo|jb)\b/i) != -1) {
		this.book = 18;
		this.bookname = "Job";
		this.longbookname = "Book_of_Job";
		this.lastchapter = 42;
	}
	if (book.search(/\b(psalms|ps|psa|psalm|psm)\b/i) != -1) {
		this.book = 19;
		this.bookname = "Psalm";
		this.longbookname = "Psalm";
		this.lastchapter = 150;
	}
	if (book.search(/\b(proverbs|prov|pr|pro|proverb|prv|prvbs)\b/i) != -1) {
		this.book = 20;
		this.bookname = "Proverbs";
		this.longbookname = "Book_of_Proverbs";
		this.lastchapter = 31;
	}
	if (book.search(/\b(ecclesiastes|eccl|ecc|eccles|ec|ecl|ecclesiaste)\b/i) != -1) {
		this.book = 21;
		this.bookname = "Ecclesiastes";
		this.longbookname = "Ecclesiastes";
		this.lastchapter = 12;
	}
	if (book.search(/\b(song\sof\ssolomon|song\sof\ssongs|sos|ss|son|so|song|songs)\b/i) != -1) {
		this.book = 22;
		this.bookname = "Song of Solomon";
		this.longbookname = "Song_of_Solomon";
		this.lastchapter = 8;
	}
	if (book.search(/\b(isaiah|is|is|isah|isai|ia)\b/i) != -1) {
		this.book = 23;
		this.bookname = "Isaiah";
		this.longbookname = "Book_of_Isaiah";
		this.lastchapter = 66;
	}
	if (book.search(/\b(jerimiah|jeremiah|jer|je|jere)\b/i) != -1) {
		this.book = 24;
		this.bookname = "Jeremiah";
		this.longbookname = "Book_of_Jeremiah";
		this.lastchapter = 52;
	}
	if (book.search(/\b(lamentations|lam|la|lamentation)\b/i) != -1) {
		this.book = 25;
		this.bookname = "Lamentations";
		this.longbookname = "Book_of_Lamentations";
		this.lastchapter = 5;
	}
	if (book.search(/\b(ezekiel|eze|ez|ezk|ezek)\b/i) != -1) {
		this.book = 26;
		this.bookname = "Ezekiel";
		this.longbookname = "Book_of_Ezekiel";
		this.lastchapter = 48;
	}
	if (book.search(/\b(daniel|dan|dn|dl|da)\b/i) != -1) {
		this.book = 27;
		this.bookname = "Daniel";
		this.longbookname = "Book_of_Daniel";
		this.lastchapter = 12;
	}
	if (book.search(/\b(hosea|hos|ho)\b/i) != -1) {
		this.book = 28;
		this.bookname = "Hosea";
		this.longbookname = "Book_of_Hosea";
		this.lastchapter = 14;
	}
	if (book.search(/\b(joel|joe|jl)\b/i) != -1) {
		this.book = 29;
		this.bookname = "Joel";
		this.longbookname = "Book_of_Joel";
		this.lastchapter = 3;
	}
	if (book.search(/\b(amos|am|amo)\b/i) != -1) {
		this.book = 30;
		this.bookname = "Amos";
		this.longbookname = "Book_of_Amos";
		this.lastchapter = 9;
	}
	if (book.search(/\b(obadiah|oba|ob|obad)\b/i) != -1) {
		this.book = 31;
		this.bookname = "Obadiah";
		this.longbookname = "Book_of_Obadiah";
		this.lastchapter = 1;
	}
	if (book.search(/\b(jonah|jnh|jon)\b/i) != -1) {
		this.book = 32;
		this.bookname = "Jonah";
		this.longbookname = "Book_of_Jonah";
		this.lastchapter = 4;
	}
	if (book.search(/\b(micah|mic|mi)\b/i) != -1) {
		this.book = 33;
		this.bookname = "Micah";
		this.longbookname = "Book_of_Micah";
		this.lastchapter = 7;
	}
	if (book.search(/\b(nahum|nah|na)\b/i) != -1) {
		this.book = 34;
		this.bookname = "Nahum";
		this.longbookname = "Book_of_Nahum";
		this.lastchapter = 3;
	}
	if (book.search(/\b(habakkuk|hab|ha|habakuk)\b/i) != -1) {
		this.book = 35;
		this.bookname = "Habakkuk";
		this.longbookname = "Book_of_Habakkuk";
		this.lastchapter = 3;
	}
	if (book.search(/\b(zephaniah|zeph|zep)\b/i) != -1) {
		this.book = 36;
		this.bookname = "Zephaniah";
		this.longbookname = "Book_of_Zephaniah";
		this.lastchapter = 3;
	}
	if (book.search(/\b(haggia|hag|hg|haggai)\b/i) != -1) {
		this.book = 37;
		this.bookname = "Haggai";
		this.longbookname = "Book_of_Haggai";
		this.lastchapter = 2;
	}
	if (book.search(/\b(zechariah|zech|zch|zec)\b/i) != -1) {
		this.book = 38;
		this.bookname = "Zechariah";
		this.longbookname = "Book_of_Zechariah";
		this.lastchapter = 14;
	}
	if (book.search(/\b(malachi|mal)\b/i) != -1) {
		this.book = 39;
		this.bookname = "Malachi";
		this.longbookname = "Book_of_Malachi";
		this.lastchapter = 4;
	}
	if (book.search(/\b(matthew|mt|matt|mat)\b/i) != -1) {
		this.book = 40;
		this.bookname = "Matthew";
		this.longbookname = "Gospel_of_Matthew";
		this.lastchapter = 28;
	}
	if (book.search(/\b(mark|mrk|mk|mr)\b/i) != -1) {
		this.book = 41;
		this.bookname = "Mark";
		this.longbookname = "Gospel_of_Mark";
		this.lastchapter = 16;
	}
	if (book.search(/\b(luke|lu|lke|luk|lk)\b/i) != -1) {
		this.book = 42;
		this.bookname = "Luke";
		this.longbookname = "Gospel_of_Luke";
		this.lastchapter = 24;
	}
	if (book.search(/\b(john|jn|jhn)\b/i) != -1) {
		this.book = 43;
		this.bookname = "John";
		this.longbookname = "Gospel_of_John";
		this.lastchapter = 21;
	}
  if (book.search(/\b(acts|ac|act)\b/i) != -1) {
		this.book = 44;
		this.bookname = "Acts";
		this.longbookname = "Acts_of_the_Apostles";
		this.lastchapter = 28;
	}
	if (book.search(/\b(romans|rom|ro|rm|roman)\b/i) != -1) {
		this.book = 45;
		this.bookname = "Romans";
		this.longbookname = "Epistle_to_the_Romans";
		this.lastchapter = 16;
	}
	if (book.search(/\b(1|i|1st|first)\s*(corinthian|cor|corinthians|corinth|corin|corth|corint)\b/i) != -1) {
		this.book = 46;
		this.bookname = "1 Corinthians";
		this.longbookname = "First_Epistle_to_the_Corinthians";
		this.lastchapter = 16;
	}
	if (book.search(/\b(2|ii|2nd|second|sec)\s*(corinthian|cor|corinthians|corinth|corin|corth|corint)\b/i) != -1) {
		this.book = 47;
		this.bookname = "2 Corinthians";
		this.longbookname = "Second_Epistle_to_the_Corinthians";
		this.lastchapter = 13;
	}
	if (book.search(/\b(galatians|galatian|galations|gal|ga|gala|galation|galat)\b/i) != -1) {
		this.book = 48;
		this.bookname = "Galatians";
		this.longbookname = "Epistle_to_the_Galatians";
		this.lastchapter = 6;
	}
	if (book.search(/\b(ephesians|eph|ep|ephes|ephe|ephs)\b/i) != -1) {
		this.book = 49;
		this.bookname = "Ephesians";
		this.longbookname = "Epistle_to_the_Ephesians";
		this.lastchapter = 6;
	}
	if (book.search(/\b(philippians|phi|phil|ph|philip)\b/i) != -1) {
		this.book = 50;
		this.bookname = "Philippians";
		this.longbookname = "Epistle_to_the_Philippians";
		this.lastchapter = 4;
	}
	if (book.search(/\b(colossians|col|co|colossian|colos|coloss)\b/i) != -1) {
		this.book = 51;
		this.bookname = "Colossians";
		this.longbookname = "Epistle_to_the_Colossians";
		this.lastchapter = 4;
	}
	if (book.search(/\b(1|i|1st|first)\s*(thessalonians|the|thessa|thessalonian|thes|thess|th)\b/i) != -1) {
		this.book = 52;
		this.bookname = "1 Thessalonians";
		this.longbookname = "First_Epistle_to_the_Thessalonians";
		this.lastchapter = 5;
	}
	if (book.search(/\b(2|ii|2nd|second|sec)\s*(thessalonians|the|thessa|thessalonian|thes|thess|th)\b/i) != -1) {
		this.book = 53;
		this.bookname = "2 Thessalonians";
		this.longbookname = "Second_Epistle_to_the_Thessalonians";
		this.lastchapter = 3;
	}
	if (book.search(/\b(1|i|1st|first)\s*(timothy|tim|ti|timoth|tm)\b/i) != -1) {
		this.book = 54;
		this.bookname = "1 Timothy";
		this.longbookname = "First_Epistle_to_Timothy";
		this.lastchapter = 6;
	}
	if (book.search(/\b(2|ii|2nd|second|sec)\s*(timothy|tim|timoth|tm)\b/i) != -1) {
		this.book = 55;
		this.bookname = "2 Timothy";
		this.longbookname = "Second_Epistle_to_Timothy";
		this.lastchapter = 4;
	}
	if (book.search(/\b(titus|tit)\b/i) != -1) {
		this.book = 56;
		this.bookname = "Titus";
		this.longbookname = "Epistle_to_Titus";
		this.lastchapter = 3;
	}
	if (book.search(/\b(philemon|phlmn|phl|phm|phile|philem)\b/i) != -1) {
		this.book = 57;
		this.bookname = "Philemon";
		this.longbookname = "Epistle_to_Philemon";
		this.lastchapter = 1;
	}
	if (book.search(/\b(hebrews|heb|he|hebrew)\b/i) != -1) {
		this.book = 58;
		this.bookname = "Hebrews";
		this.longbookname = "Epistle_to_the_Hebrews";
		this.lastchapter = 13;
	}
	if (book.search(/\b(james|jam|ja|jas|jms|jame|jm)\b/i) != -1) {
		this.book = 59;
		this.bookname = "James";
		this.longbookname = "Epistle_of_James";
		this.lastchapter = 5;
	}
	if (book.search(/\b(1|i|1st|first)\s*(peter|pe|pet|pete|pt|p)\b/i) != -1) {
		this.book = 60;
		this.bookname = "1 Peter";
		this.longbookname = "First_Epistle_of_Peter";
		this.lastchapter = 5;
	}
	if (book.search(/\b(2|ii|2nd|second|sec)\s*(peter|pe|pet|pete|pt|p)\b/i) != -1) {
		this.book = 61;
		this.bookname = "2 Peter";
		this.longbookname = "Second_Epistle_of_Peter";
		this.lastchapter = 3;
	}
	if (book.search(/\b(1|i|1st|first)\s*(john|jn|jo)\b/i) != -1) {
		this.book = 62;
		this.bookname = "1 John";
		this.longbookname = "First_Epistle_of_John";
		this.lastchapter = 5;
	}
	if (book.search(/\b(2|ii|2nd|second|sec)\s*(john|jn|jo)\b/i) != -1) {
		this.book = 63;
		this.bookname = "2 John";
		this.longbookname = "Second_Epistle_of_John";
		this.lastchapter = 1;
	}
	if (book.search(/\b(3|iii|3rd|third)\s*(john|jn|jo)\b/i) != -1) {
		this.book = 64;
		this.bookname = "3 John";
		this.longbookname = "Third_Epistle_of_John";
		this.lastchapter = 1;
	}
	if (book.search(/\b(jude|jud|ju)\b/i) != -1) {
		this.book = 65;
		this.bookname = "Jude";
		this.longbookname = "Epistle_of_Jude";
		this.lastchapter = 1;
	}
	if (book.search(/\b(revelation|rev|re|revelations|rv)\b/i) != -1) {
		this.book = 66;
		this.bookname = "Revelation";
		this.longbookname = "Book_of_Revelations";
		this.lastchapter = 22;
	}
			var chvs = bibleRef.substring(bibleRef.search(/\s\d/)+1, bibleRef.length);
			
			if (chvs.search(":") == -1) {
				this.chapter = parseInt(chvs.substring(chvs.search(/\s\d\s/) +1,chvs.length));
				this.startverse = 1;
				this.endverse = "*";
			} else {
				this.chapter = parseInt(chvs.substring(chvs.search(/\s\d\:/) +1, chvs.search(":")));
					var vss = chvs.substring(chvs.search(":") + 1, chvs.length);
					
					if (vss.search("-") != -1) {
						this.startverse = parseInt(vss.substring(0, vss.search("-")));
						var ev = vss.substring(vss.search("-") + 1, vss.length);
						if (ev != "*") {
							this.endverse = parseInt(ev);
						} else {
							this.endverse = ev;
						}
					} else {
						this.startverse = parseInt(vss);
						this.endverse = parseInt(vss);
					}
			}
}

function bookName(booknum) {
	var book = new Array();
	book[0] = "";
	book[1] = "Genesis";
  book[2] = "Exodus";
  book[3] = "Leviticus";
  book[4] = "Numbers";
  book[5] = "Deuteronomy";
  book[6] = "Joshua";
  book[7] = "Judges";
  book[8] = "Ruth";
  book[9] = "1 Samuel";
  book[10] = "2 Samuel";
  book[11] = "1 Kings";
  book[12] = "2 Kings";
  book[13] = "1 Chronicles";
  book[14] = "2 Chronicles";
  book[15] = "Ezra";
  book[16] = "Nehemiah";
  book[17] = "Esther";
  book[18] = "Job";
  book[19] = "Psalm";
  book[20] = "Proverbs";
  book[21] = "Ecclesiastes";
  book[22] = "Song of Songs";
  book[23] = "Isaiah";
  book[24] = "Jeremiah";
  book[25] = "Lamentations";
  book[26] = "Ezekiel";
  book[27] = "Daniel";
  book[28] = "Hosea";
  book[29] = "Joel";
  book[30] = "Amos";
  book[31] = "Obadiah";
  book[32] = "Jonah";
  book[33] = "Micah";
  book[34] = "Nahum";
  book[35] = "Habakkuk";
  book[36] = "Zephaniah";
  book[37] = "Haggai";
  book[38] = "Zechariah";
  book[39] = "Malachi";
  book[40] = "Matthew";
  book[41] = "Mark";
  book[42] = "Luke";
  book[43] = "John";
  book[44] = "Acts";
  book[45] = "Romans";
  book[46] = "1 Corinthians";
  book[47] = "2 Corinthians";
  book[48] = "Galatians";
	book[49] = "Ephesians";
  book[50] = "Philippians";
  book[51] = "Colossians";
  book[52] = "1 Thessalonians";
  book[53] = "2 Thessalonians";
  book[54] = "1 Timothy";
  book[55] = "2 Timothy";
  book[56] = "Titus";
  book[57] = "Philemon";
  book[58] = "Hebrews";
  book[59] = "James";
  book[60] = "1 Peter";
  book[61] = "2 Peter";
  book[62] = "1 John";
  book[63] = "2 John";
  book[64] = "3 John";
  book[65] = "Jude";
  book[66] = "Revelation";
	
	return book[booknum];
}
