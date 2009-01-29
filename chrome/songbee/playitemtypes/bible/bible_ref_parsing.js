// 
// This code was written by Jason Wall.  Feel free to use, and if you can, include a link back to www.walljm.com
// Jason@walljm.com // www.walljm.com
//

var booksizes = [
    [],
    [31, 25, 24, 26, 32, 22, 24, 22, 29, 32, 32, 20, 18, 24, 21, 16, 27, 33, 38, 18, 34, 24, 20, 67, 34, 35, 46, 22, 35, 43, 55, 32, 20, 31, 29, 43, 36, 30, 23, 23, 57, 38, 34, 34, 28, 34, 31, 22, 33, 26],
    [22, 25, 22, 31, 23, 30, 25, 32, 35, 29, 10, 51, 22, 31, 27, 36, 16, 27, 25, 26, 36, 31, 33, 18, 40, 37, 21, 43, 46, 38, 18, 35, 23, 35, 35, 38, 29, 31, 43, 38],
    [17, 16, 17, 35, 19, 30, 38, 36, 24, 20, 47, 8, 59, 57, 33, 34, 16, 30, 37, 27, 24, 33, 44, 23, 55, 46, 34],
    [54, 34, 51, 49, 31, 27, 89, 26, 23, 36, 35, 16, 33, 45, 41, 50, 13, 32, 22, 29, 35, 41, 30, 25, 18, 65, 23, 31, 40, 16, 54, 42, 56, 29, 34, 13],
    [46, 37, 29, 49, 33, 25, 26, 20, 29, 22, 32, 32, 18, 29, 23, 22, 20, 22, 21, 20, 23, 30, 25, 22, 19, 19, 26, 68, 29, 20, 30, 52, 29, 12],
    [18, 24, 17, 24, 15, 27, 26, 35, 27, 43, 23, 24, 33, 15, 63, 10, 18, 28, 51, 9, 45, 34, 16, 33],
    [36, 23, 31, 24, 31, 40, 25, 35, 57, 18, 40, 15, 25, 20, 20, 31, 13, 31, 30, 48, 25],
    [22, 23, 18, 22],
    [28, 36, 21, 22, 12, 21, 17, 22, 27, 27, 15, 25, 23, 52, 35, 23, 58, 30, 24, 42, 15, 23, 29, 22, 44, 25, 12, 25, 11, 31, 13],
    [27, 32, 39, 12, 25, 23, 29, 18, 13, 19, 27, 31, 39, 33, 37, 23, 29, 33, 43, 26, 22, 51, 39, 25],
    [53, 46, 28, 34, 18, 38, 51, 66, 28, 29, 43, 33, 34, 31, 34, 34, 24, 46, 21, 43, 29, 53],
    [18, 25, 27, 44, 27, 33, 20, 29, 37, 36, 21, 21, 25, 29, 38, 20, 41, 37, 37, 21, 26, 20, 37, 20, 30],
    [54, 55, 24, 43, 26, 81, 40, 40, 44, 14, 47, 40, 14, 17, 29, 43, 27, 17, 19, 8, 30, 19, 32, 31, 31, 32, 34, 21, 30],
    [17, 18, 17, 22, 14, 42, 22, 18, 31, 19, 23, 16, 22, 15, 19, 14, 19, 34, 11, 37, 20, 12, 21, 27, 28, 23, 9, 27, 36, 27, 21, 33, 25, 33, 27, 23],
    [11, 70, 13, 24, 17, 22, 28, 36, 15, 44],
    [11, 20, 32, 23, 19, 19, 73, 18, 38, 39, 36, 47, 31],
    [22, 23, 15, 17, 14, 14, 10, 17, 32, 3],
    [22, 13, 26, 21, 27, 30, 21, 22, 35, 22, 20, 25, 28, 22, 35, 22, 16, 21, 29, 29, 34, 30, 17, 25, 6, 14, 23, 28, 25, 31, 40, 22, 33, 37, 16, 33, 24, 41, 30, 24, 34, 17],
    [6, 12, 8, 8, 12, 10, 17, 9, 20, 18, 7, 8, 6, 7, 5, 11, 15, 50, 14, 9, 13, 31, 6, 10, 22, 12, 14, 9, 11, 12, 24, 11, 22, 22, 28, 12, 40, 22, 13, 17, 13, 11, 5, 26, 17, 11, 9, 14, 20, 23, 19, 9, 6, 7, 23, 13, 11, 11, 17, 12, 8, 12, 11, 10, 13, 20, 7, 35, 36, 5, 24, 20, 28, 23, 10, 12, 20, 72, 13, 19, 16, 8, 18, 12, 13, 17, 7, 18, 52, 17, 16, 15, 5, 23, 11, 13, 12, 9, 9, 5, 8, 28, 22, 35, 45, 48, 43, 13, 31, 7, 10, 10, 9, 8, 18, 19, 2, 29, 176, 7, 8, 9, 4, 8, 5, 6, 5, 6, 8, 8, 3, 18, 3, 3, 21, 26, 9, 8, 24, 13, 10, 7, 12, 15, 21, 10, 20, 14, 9, 6],
    [33, 22, 35, 27, 23, 35, 27, 36, 18, 32, 31, 28, 25, 35, 33, 33, 28, 24, 29, 30, 31, 29, 35, 34, 28, 28, 27, 28, 27, 33, 31],
    [18, 26, 22, 16, 20, 12, 29, 17, 18, 20, 10, 14],
    [17, 17, 11, 16, 16, 13, 13, 14],
    [31, 22, 26, 6, 30, 13, 25, 22, 21, 34, 16, 6, 22, 32, 9, 14, 14, 7, 25, 6, 17, 25, 18, 23, 12, 21, 13, 29, 24, 33, 9, 20, 24, 17, 10, 22, 38, 22, 8, 31, 29, 25, 28, 28, 25, 13, 15, 22, 26, 11, 23, 15, 12, 17, 13, 12, 21, 14, 21, 22, 11, 12, 19, 12, 25, 24],
    [19, 37, 25, 31, 31, 30, 34, 22, 26, 25, 23, 17, 27, 22, 21, 21, 27, 23, 15, 18, 14, 30, 40, 10, 38, 24, 22, 17, 32, 24, 40, 44, 26, 22, 19, 32, 21, 28, 18, 16, 18, 22, 13, 30, 5, 28, 7, 47, 39, 46, 64, 34],
    [22, 22, 66, 22, 22],
    [28, 10, 27, 17, 17, 14, 27, 18, 11, 22, 25, 28, 23, 23, 8, 63, 24, 32, 14, 49, 32, 31, 49, 27, 17, 21, 36, 26, 21, 26, 18, 32, 33, 31, 15, 38, 28, 23, 29, 49, 26, 20, 27, 31, 25, 24, 23, 35],
    [21, 49, 30, 37, 31, 28, 28, 27, 27, 21, 45, 13],
    [11, 23, 5, 19, 15, 11, 16, 14, 17, 15, 12, 14, 16, 9],
    [20, 32, 21],
    [15, 16, 15, 13, 27, 14, 17, 14, 15],
    [21],
    [16, 10, 10, 11],
    [16, 13, 12, 13, 15, 16, 20],
    [15, 13, 19],
    [17, 20, 19],
    [18, 15, 20],
    [15, 23],
    [21, 13, 10, 14, 11, 15, 14, 23, 17, 12, 17, 14, 9, 21],
    [14, 17, 18, 6],
    [25, 23, 17, 25, 48, 34, 29, 34, 38, 42, 30, 50, 58, 36, 39, 28, 27, 35, 30, 34, 46, 46, 39, 51, 46, 75, 66, 20],
    [45, 28, 35, 41, 43, 56, 37, 38, 50, 52, 33, 44, 37, 72, 47, 20],
    [80, 52, 38, 44, 39, 49, 50, 56, 62, 42, 54, 59, 35, 35, 32, 31, 37, 43, 48, 47, 38, 71, 56, 53],
    [51, 25, 36, 54, 47, 71, 53, 59, 41, 42, 57, 50, 38, 31, 27, 33, 26, 40, 42, 31, 25],
    [26, 47, 26, 37, 42, 15, 60, 40, 43, 48, 30, 25, 52, 28, 41, 40, 34, 28, 41, 38, 40, 30, 35, 27, 27, 32, 44, 31],
    [32, 29, 31, 25, 21, 23, 25, 39, 33, 21, 36, 21, 14, 23, 33, 27],
    [31, 16, 23, 21, 13, 20, 40, 13, 27, 33, 34, 31, 13, 40, 58, 24],
    [24, 17, 18, 18, 21, 18, 16, 24, 15, 18, 33, 21, 13],
    [24, 21, 29, 31, 26, 18],
    [23, 22, 21, 32, 33, 24],
    [30, 30, 21, 23],
    [29, 23, 25, 18],
    [10, 20, 13, 18, 28],
    [12, 17, 18],
    [20, 15, 16, 16, 25, 21],
    [18, 26, 17, 22],
    [16, 15, 15],
    [25],
    [14, 18, 19, 16, 14, 20, 28, 13, 28, 39, 40, 29, 25],
    [27, 26, 18, 17, 20],
    [25, 25, 22, 19, 14],
    [21, 22, 18],
    [10, 29, 24, 21, 21],
    [13],
    [15],
    [25],
    [20, 29, 22, 11, 14, 17, 17, 13, 21, 11, 19, 18, 18, 20, 8, 21, 18, 24, 21, 15, 27, 21]
];

var bookinfo = [
    {},
 { bookname: "Genesis", longbookname: "Genesis", lastchapter: 50 },
 { bookname: "Exodus", longbookname: "Exodus", lastchapter: 40 },
 { bookname: "Leviticus", longbookname: "Leviticus", lastchapter: 27 },
 { bookname: "Numbers", longbookname: "Book_of_Numbers", lastchapter: 36 },
 { bookname: "Deuteronomy", longbookname: "Deuteronomy", lastchapter: 34 },
 { bookname: "Joshua", longbookname: "Book_of_Joshua", lastchapter: 24 },
 { bookname: "Judges", longbookname: "Book_of_Judges", lastchapter: 21 },
 { bookname: "Ruth", longbookname: "Book_of_Ruth", lastchapter: 4 },
 { bookname: "1 Samuel", longbookname: "First_Samuel", lastchapter: 31 },
 { bookname: "2 Samuel", longbookname: "Second_Samuel", lastchapter: 24 },
 { bookname: "1 Kings", longbookname: "First_Kings", lastchapter: 22 },
 { bookname: "2 Kings", longbookname: "Second_Kings", lastchapter: 25 },
 { bookname: "1 Chronicles", longbookname: "First_Chronicles", lastchapter: 29 },
 { bookname: "2 Chronicles", longbookname: "Second_Chronicles", lastchapter: 36 },
 { bookname: "Ezra", longbookname: "Book_of_Ezra", lastchapter: 10 },
 { bookname: "Nehemiah", longbookname: "Book_of_Nehemiah", lastchapter: 13 },
 { bookname: "Esther", longbookname: "Book_of_Esther", lastchapter: 10 },
 { bookname: "Job", longbookname: "Book_of_Job", lastchapter: 42 },
 { bookname: "Psalm", longbookname: "Psalm", lastchapter: 150 },
 { bookname: "Proverbs", longbookname: "Book_of_Proverbs", lastchapter: 31 },
 { bookname: "Ecclesiastes", longbookname: "Ecclesiastes", lastchapter: 12 },
 { bookname: "Song of Solomon", longbookname: "Song_of_Solomon", lastchapter: 8 },
 { bookname: "Isaiah", longbookname: "Book_of_Isaiah", lastchapter: 66 },
 { bookname: "Jeremiah", longbookname: "Book_of_Jeremiah", lastchapter: 52 },
 { bookname: "Lamentations", longbookname: "Book_of_Lamentations", lastchapter: 5 },
 { bookname: "Ezekiel", longbookname: "Book_of_Ezekiel", lastchapter: 48 },
 { bookname: "Daniel", longbookname: "Book_of_Daniel", lastchapter: 12 },
 { bookname: "Hosea", longbookname: "Book_of_Hosea", lastchapter: 14 },
 { bookname: "Joel", longbookname: "Book_of_Joel", lastchapter: 3 },
 { bookname: "Amos", longbookname: "Book_of_Amos", lastchapter: 9 },
 { bookname: "Obadiah", longbookname: "Book_of_Obadiah", lastchapter: 1 },
 { bookname: "Jonah", longbookname: "Book_of_Jonah", lastchapter: 4 },
 { bookname: "Micah", longbookname: "Book_of_Micah", lastchapter: 7 },
 { bookname: "Nahum", longbookname: "Book_of_Nahum", lastchapter: 3 },
 { bookname: "Habakkuk", longbookname: "Book_of_Habakkuk", lastchapter: 3 },
 { bookname: "Zephaniah", longbookname: "Book_of_Zephaniah", lastchapter: 3 },
 { bookname: "Haggai", longbookname: "Book_of_Haggai", lastchapter: 2 },
 { bookname: "Zechariah", longbookname: "Book_of_Zechariah", lastchapter: 14 },
 { bookname: "Malachi", longbookname: "Book_of_Malachi", lastchapter: 4 },
 { bookname: "Matthew", longbookname: "Gospel_of_Matthew", lastchapter: 28 },
 { bookname: "Mark", longbookname: "Gospel_of_Mark", lastchapter: 16 },
 { bookname: "Luke", longbookname: "Gospel_of_Luke", lastchapter: 24 },
 { bookname: "John", longbookname: "Gospel_of_John", lastchapter: 21 },
 { bookname: "Acts", longbookname: "Acts_of_the_Apostles", lastchapter: 28 },
 { bookname: "Romans", longbookname: "Epistle_to_the_Romans", lastchapter: 16 },
 { bookname: "1 Corinthians", longbookname: "First_Epistle_to_the_Corinthians", lastchapter: 16 },
 { bookname: "2 Corinthians", longbookname: "Second_Epistle_to_the_Corinthians", lastchapter: 13 },
 { bookname: "Galatians", longbookname: "Epistle_to_the_Galatians", lastchapter: 6 },
 { bookname: "Ephesians", longbookname: "Epistle_to_the_Ephesians", lastchapter: 6 },
 { bookname: "Philippians", longbookname: "Epistle_to_the_Philippians", lastchapter: 4 },
 { bookname: "Colossians", longbookname: "Epistle_to_the_Colossians", lastchapter: 4 },
 { bookname: "1 Thessalonians", longbookname: "First_Epistle_to_the_Thessalonians", lastchapter: 5 },
 { bookname: "2 Thessalonians", longbookname: "Second_Epistle_to_the_Thessalonians", lastchapter: 3 },
 { bookname: "1 Timothy", longbookname: "First_Epistle_to_Timothy", lastchapter: 6 },
 { bookname: "2 Timothy", longbookname: "Second_Epistle_to_Timothy", lastchapter: 4 },
 { bookname: "Titus", longbookname: "Epistle_to_Titus", lastchapter: 3 },
 { bookname: "Philemon", longbookname: "Epistle_to_Philemon", lastchapter: 1 },
 { bookname: "Hebrews", longbookname: "Epistle_to_the_Hebrews", lastchapter: 13 },
 { bookname: "James", longbookname: "Epistle_of_James", lastchapter: 5 },
 { bookname: "1 Peter", longbookname: "First_Epistle_of_Peter", lastchapter: 5 },
 { bookname: "2 Peter", longbookname: "Second_Epistle_of_Peter", lastchapter: 3 },
 { bookname: "1 John", longbookname: "First_Epistle_of_John", lastchapter: 5 },
 { bookname: "2 John", longbookname: "Second_Epistle_of_John", lastchapter: 1 },
 { bookname: "3 John", longbookname: "Third_Epistle_of_John", lastchapter: 1 },
 { bookname: "Jude", longbookname: "Epistle_of_Jude", lastchapter: 1 },
 { bookname: "Revelation", longbookname: "Book_of_Revelations", lastchapter: 22 },
];

function Reference(bibleRef) {
	bibleRef = bibleRef.toLowerCase();
	var bibleNames = new Object;
	var book = bibleRef.substring(0, bibleRef.search(/\s\d/i));
	
	if (book.search(/\b(genesis|gen|ge|gn)\b/i) != -1) { this.book = 1; }
	if (book.search(/\b(exodus|ex|exo|exod|exd)\b/i) != -1) { this.book = 2; }
	if (book.search(/\b(leviticus|lev|le|levi|lv)\b/i) != -1) { this.book = 3; }
	if (book.search(/\b(numbers|num|nu|numb|number)\b/i) != -1) { this.book = 4; }
	if (book.search(/\b(deuteronomy|deut|de|dt|deu)\b/i) != -1) { this.book = 5; }
	if (book.search(/\b(joshua|josh|jos)\b/i) != -1) { this.book = 6; }
	if (book.search(/\b(judges|jud|ju|jdg|judg)\b/i) != -1) { this.book = 7; }
	if (book.search(/\b(ruth|ru)\b/i) != -1) { this.book = 8; }
	if (book.search(/\b(1|i|1st|first)\s*(samuel|sa|sam|sml)\b/i) != -1) { this.book = 9; }
	if (book.search(/\b(2|ii|2nd|second|sec)\s*(samuel|sa|sam|sml)\b/i) != -1) { this.book = 10; }
	if (book.search(/\b(1|i|1st|first)\s*(kings|king|kgs|kn|k|ki)\b/i) != -1) { this.book = 11; }
	if (book.search(/\b(2|ii|2nd|second|sec)\s*(kings|king|kgs|kn|k|ki)\b/i) != -1) { this.book = 12; }
	if (book.search(/\b(1|i|1st|first)\s*(chronicles|chron|ch|chr)\b/i) != -1) { this.book = 13; }
	if (book.search(/\b(2|ii|2nd|second|sec)\s*(chronicles|chron|ch|chr)\b/i) != -1) { this.book = 14; }
	if (book.search(/\b(ezra|ez|ezr)\b/i) != -1) { this.book = 15; }
	if (book.search(/\b(nehemiah|neh|ne|nehamiah)\b/i) != -1) { this.book = 16; }
	if (book.search(/\b(esther|est|es|esth)\b/i) != -1) { this.book = 17; }
        if (book.search(/\b(job|jo|jb)\b/i) != -1) { this.book = 18; }
	if (book.search(/\b(psalms|ps|psa|psalm|psm)\b/i) != -1) { this.book = 19; }
	if (book.search(/\b(proverbs|prov|pr|pro|proverb|prv|prvbs)\b/i) != -1) { this.book = 20; }
	if (book.search(/\b(ecclesiastes|eccl|ecc|eccles|ec|ecl|ecclesiaste)\b/i) != -1) { this.book = 21; }
	if (book.search(/\b(song\sof\ssolomon|song\sof\ssongs|sos|ss|son|so|song|songs)\b/i) != -1) { this.book = 22; }
	if (book.search(/\b(isaiah|is|is|isah|isai|ia)\b/i) != -1) { this.book = 23; }
	if (book.search(/\b(jerimiah|jeremiah|jer|je|jere)\b/i) != -1) { this.book = 24; }
	if (book.search(/\b(lamentations|lam|la|lamentation)\b/i) != -1) { this.book = 25; }
	if (book.search(/\b(ezekiel|eze|ez|ezk|ezek)\b/i) != -1) { this.book = 26; }
	if (book.search(/\b(daniel|dan|dn|dl|da)\b/i) != -1) { this.book = 27; }
	if (book.search(/\b(hosea|hos|ho)\b/i) != -1) { this.book = 28; }
	if (book.search(/\b(joel|joe|jl)\b/i) != -1) { this.book = 29; }
	if (book.search(/\b(amos|am|amo)\b/i) != -1) { this.book = 30; }
	if (book.search(/\b(obadiah|oba|ob|obad)\b/i) != -1) { this.book = 31; }
	if (book.search(/\b(jonah|jnh|jon)\b/i) != -1) { this.book = 32; }
	if (book.search(/\b(micah|mic|mi)\b/i) != -1) { this.book = 33; }
	if (book.search(/\b(nahum|nah|na)\b/i) != -1) { this.book = 34; }
	if (book.search(/\b(habakkuk|hab|ha|habakuk)\b/i) != -1) { this.book = 35; }
	if (book.search(/\b(zephaniah|zeph|zep)\b/i) != -1) { this.book = 36; }
	if (book.search(/\b(haggia|hag|hg|haggai)\b/i) != -1) { this.book = 37; }
	if (book.search(/\b(zechariah|zech|zch|zec)\b/i) != -1) { this.book = 38; }
	if (book.search(/\b(malachi|mal)\b/i) != -1) { this.book = 39; }
	if (book.search(/\b(matthew|mt|matt|mat)\b/i) != -1) { this.book = 40; }
	if (book.search(/\b(mark|mrk|mk|mr)\b/i) != -1) { this.book = 41; }
	if (book.search(/\b(luke|lu|lke|luk|lk)\b/i) != -1) { this.book = 42; }
	if (book.search(/\b(john|jn|jhn)\b/i) != -1) { this.book = 43; }
  if (book.search(/\b(acts|ac|act)\b/i) != -1) { this.book = 44; }
	if (book.search(/\b(romans|rom|ro|rm|roman)\b/i) != -1) { this.book = 45; }
	if (book.search(/\b(1|i|1st|first)\s*(corinthian|cor|corinthians|corinth|corin|corth|corint)\b/i) != -1) { this.book = 46; }
	if (book.search(/\b(2|ii|2nd|second|sec)\s*(corinthian|cor|corinthians|corinth|corin|corth|corint)\b/i) != -1) { this.book = 47; }
	if (book.search(/\b(galatians|galatian|galations|gal|ga|gala|galation|galat)\b/i) != -1) { this.book = 48; }
	if (book.search(/\b(ephesians|eph|ep|ephes|ephe|ephs)\b/i) != -1) { this.book = 49; }
	if (book.search(/\b(philippians|phi|phil|ph|philip)\b/i) != -1) { this.book = 50; }
	if (book.search(/\b(colossians|col|co|colossian|colos|coloss)\b/i) != -1) { this.book = 51; }
	if (book.search(/\b(1|i|1st|first)\s*(thessalonians|the|thessa|thessalonian|thes|thess|th)\b/i) != -1) { this.book = 52; }
	if (book.search(/\b(2|ii|2nd|second|sec)\s*(thessalonians|the|thessa|thessalonian|thes|thess|th)\b/i) != -1) { this.book = 53; }
	if (book.search(/\b(1|i|1st|first)\s*(timothy|tim|ti|timoth|tm)\b/i) != -1) { this.book = 54; }
	if (book.search(/\b(2|ii|2nd|second|sec)\s*(timothy|tim|timoth|tm)\b/i) != -1) { this.book = 55; }
	if (book.search(/\b(titus|tit)\b/i) != -1) { this.book = 56; }
	if (book.search(/\b(philemon|phlmn|phl|phm|phile|philem)\b/i) != -1) { this.book = 57; }
	if (book.search(/\b(hebrews|heb|he|hebrew)\b/i) != -1) { this.book = 58; }
	if (book.search(/\b(james|jam|ja|jas|jms|jame|jm)\b/i) != -1) { this.book = 59; }
	if (book.search(/\b(1|i|1st|first)\s*(peter|pe|pet|pete|pt|p)\b/i) != -1) { this.book = 60; }
	if (book.search(/\b(2|ii|2nd|second|sec)\s*(peter|pe|pet|pete|pt|p)\b/i) != -1) { this.book = 61; }
	if (book.search(/\b(1|i|1st|first)\s*(john|jn|jo)\b/i) != -1) { this.book = 62; }
	if (book.search(/\b(2|ii|2nd|second|sec)\s*(john|jn|jo)\b/i) != -1) { this.book = 63; }
	if (book.search(/\b(3|iii|3rd|third)\s*(john|jn|jo)\b/i) != -1) { this.book = 64; }
	if (book.search(/\b(jude|jud|ju)\b/i) != -1) { this.book = 65; }
	if (book.search(/\b(revelation|rev|re|revelations|rv)\b/i) != -1) { this.book = 66; }

        this.bookname     = bookinfo[this.book].bookname;
        this.longbookname = bookinfo[this.book].longbookname;
        this.lastchapter  = bookinfo[this.book].lastchapter;

        var chvs = bibleRef.substring(bibleRef.search(/\s\d/)+1, bibleRef.length);
        
        if (chvs.search(":") == -1) {
                this.chapter = parseInt(chvs.substring(chvs.search(/\s\d\s/) +1,chvs.length));
                this.startverse = 1;
                this.endverse = booksizes[this.book][this.chapter-1];
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
                                if (!this.endverse) { this.endverse = booksizes[this.book][this.chapter-1]; }
                        } else {
                                this.startverse = parseInt(vss);
                                this.endverse = parseInt(vss);
                        }
        }
}
