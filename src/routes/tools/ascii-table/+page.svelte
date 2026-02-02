<script>
	const controlCodes = [
		{ code: 0, value: 'NUL', description: 'null character' },
		{ code: 1, value: 'SOH', description: 'start of header' },
		{ code: 2, value: 'STX', description: 'start of text' },
		{ code: 3, value: 'ETX', description: 'end of text' },
		{ code: 4, value: 'EOT', description: 'end of transmission' },
		{ code: 5, value: 'ENQ', description: 'enquiry' },
		{ code: 6, value: 'ACK', description: 'acknowledgment' },
		{ code: 7, value: 'BEL', description: 'bell' },
		{ code: 8, value: 'BS', description: 'backspace' },
		{ code: 9, value: 'HT', description: 'horizontal tab' },
		{ code: 10, value: 'LF', description: 'line feed' },
		{ code: 11, value: 'VT', description: 'vertical tab' },
		{ code: 12, value: 'FF', description: 'form feed' },
		{ code: 13, value: 'CR', description: 'carriage return' },
		{ code: 14, value: 'SO', description: 'shift out' },
		{ code: 15, value: 'SI', description: 'shift in' },
		{ code: 16, value: 'DLE', description: 'data link escape' },
		{ code: 17, value: 'DC1', description: 'device control 1 (XON)' },
		{ code: 18, value: 'DC2', description: 'device control 2' },
		{ code: 19, value: 'DC3', description: 'device control 3 (XOFF)' },
		{ code: 20, value: 'DC4', description: 'device control 4' },
		{ code: 21, value: 'NAK', description: 'negative acknowledgment' },
		{ code: 22, value: 'SYN', description: 'synchronous idle' },
		{ code: 23, value: 'ETB', description: 'end of transmission block' },
		{ code: 24, value: 'CAN', description: 'cancel' },
		{ code: 25, value: 'EM', description: 'end of medium' },
		{ code: 26, value: 'SUB', description: 'substitute' },
		{ code: 27, value: 'ESC', description: 'escape' },
		{ code: 28, value: 'FS', description: 'file separator' },
		{ code: 29, value: 'GS', description: 'group separator' },
		{ code: 30, value: 'RS', description: 'record separator' },
		{ code: 31, value: 'US', description: 'unit separator' },
		{ code: 32, value: 'SP', description: 'space' },
		{ code: 127, value: 'DEL', description: 'delete' }
	];

	const punctuationDescriptions = {
		33: 'exclamation mark',
		34: 'double quote',
		35: 'number sign',
		36: 'dollar sign',
		37: 'percent sign',
		38: 'ampersand',
		39: 'apostrophe',
		40: 'left parenthesis',
		41: 'right parenthesis',
		42: 'asterisk',
		43: 'plus sign',
		44: 'comma',
		45: 'minus sign',
		46: 'period',
		47: 'slash',
		58: 'colon',
		59: 'semicolon',
		60: 'less than',
		61: 'equals sign',
		62: 'greater than',
		63: 'question mark',
		64: 'at sign',
		91: 'left bracket',
		92: 'backslash',
		93: 'right bracket',
		94: 'caret',
		95: 'underscore',
		96: 'grave accent',
		123: 'left brace',
		124: 'vertical bar',
		125: 'right brace',
		126: 'tilde'
	};

	const toBinary = (value) => value.toString(2).padStart(8, '0');
	const formatBinary = (value) => {
		const bits = toBinary(value);
		return `${bits.slice(0, 4)} ${bits.slice(4)}`;
	};

	const extendedAscii = [
		{
			decimal: '128',
			octal: '200',
			hex: '80',
			binary: '1000 0000',
			value: 'Ç',
			description: 'capital letter c with cedilla'
		},
		{
			decimal: '129',
			octal: '201',
			hex: '81',
			binary: '1000 0001',
			value: 'ü',
			description: 'letter u with diaeresis'
		},
		{
			decimal: '130',
			octal: '202',
			hex: '82',
			binary: '1000 0010',
			value: 'é',
			description: 'letter e with acute'
		},
		{
			decimal: '131',
			octal: '203',
			hex: '83',
			binary: '1000 0011',
			value: 'â',
			description: 'letter a with circumflex'
		},
		{
			decimal: '132',
			octal: '204',
			hex: '84',
			binary: '1000 0100',
			value: 'ä',
			description: 'letter a with diaeresis'
		},
		{
			decimal: '133',
			octal: '205',
			hex: '85',
			binary: '1000 0101',
			value: 'à',
			description: 'letter a with grave'
		},
		{
			decimal: '134',
			octal: '206',
			hex: '86',
			binary: '1000 0110',
			value: 'å',
			description: 'letter a with ring above'
		},
		{
			decimal: '135',
			octal: '207',
			hex: '87',
			binary: '1000 0111',
			value: 'ç',
			description: 'letter c with cedilla'
		},
		{
			decimal: '136',
			octal: '210',
			hex: '88',
			binary: '1000 1000',
			value: 'ê',
			description: 'letter e with circumflex'
		},
		{
			decimal: '137',
			octal: '211',
			hex: '89',
			binary: '1000 1001',
			value: 'ë',
			description: 'letter e with diaeresis'
		},
		{
			decimal: '138',
			octal: '212',
			hex: '8A',
			binary: '1000 1010',
			value: 'è',
			description: 'letter e with grave'
		},
		{
			decimal: '139',
			octal: '213',
			hex: '8B',
			binary: '1000 1011',
			value: 'ï',
			description: 'letter i with diaeresis'
		},
		{
			decimal: '140',
			octal: '214',
			hex: '8C',
			binary: '1000 1100',
			value: 'î',
			description: 'letter i with circumflex'
		},
		{
			decimal: '141',
			octal: '215',
			hex: '8D',
			binary: '1000 1101',
			value: 'ì',
			description: 'letter i with grave'
		},
		{
			decimal: '142',
			octal: '216',
			hex: '8E',
			binary: '1000 1110',
			value: 'Ä',
			description: 'capital letter a with diaeresis'
		},
		{
			decimal: '143',
			octal: '217',
			hex: '8F',
			binary: '1000 1111',
			value: 'Å',
			description: 'capital letter a with ring above'
		},
		{
			decimal: '144',
			octal: '220',
			hex: '90',
			binary: '1001 0000',
			value: 'É',
			description: 'capital letter e with acute'
		},
		{
			decimal: '145',
			octal: '221',
			hex: '91',
			binary: '1001 0001',
			value: 'æ',
			description: 'letter ae'
		},
		{
			decimal: '146',
			octal: '222',
			hex: '92',
			binary: '1001 0010',
			value: 'Æ',
			description: 'capital letter ae'
		},
		{
			decimal: '147',
			octal: '223',
			hex: '93',
			binary: '1001 0011',
			value: 'ô',
			description: 'letter o with circumflex'
		},
		{
			decimal: '148',
			octal: '224',
			hex: '94',
			binary: '1001 0100',
			value: 'ö',
			description: 'letter o with diaeresis'
		},
		{
			decimal: '149',
			octal: '225',
			hex: '95',
			binary: '1001 0101',
			value: 'ò',
			description: 'letter o with grave'
		},
		{
			decimal: '150',
			octal: '226',
			hex: '96',
			binary: '1001 0110',
			value: 'û',
			description: 'letter u with circumflex'
		},
		{
			decimal: '151',
			octal: '227',
			hex: '97',
			binary: '1001 0111',
			value: 'ù',
			description: 'letter u with grave'
		},
		{
			decimal: '152',
			octal: '230',
			hex: '98',
			binary: '1001 1000',
			value: 'ÿ',
			description: 'letter y with diaeresis'
		},
		{
			decimal: '153',
			octal: '231',
			hex: '99',
			binary: '1001 1001',
			value: 'Ö',
			description: 'capital letter o with diaeresis'
		},
		{
			decimal: '154',
			octal: '232',
			hex: '9A',
			binary: '1001 1010',
			value: 'Ü',
			description: 'capital letter u with diaeresis'
		},
		{
			decimal: '155',
			octal: '233',
			hex: '9B',
			binary: '1001 1011',
			value: '¢',
			description: 'letter o with stroke'
		},
		{
			decimal: '156',
			octal: '234',
			hex: '9C',
			binary: '1001 1100',
			value: '£',
			description: 'pound sign'
		},
		{
			decimal: '157',
			octal: '235',
			hex: '9D',
			binary: '1001 1101',
			value: '¥',
			description: 'yen sign'
		},
		{
			decimal: '158',
			octal: '236',
			hex: '9E',
			binary: '1001 1110',
			value: '₧',
			description: 'peseta sign'
		},
		{
			decimal: '159',
			octal: '237',
			hex: '9F',
			binary: '1001 1111',
			value: 'ƒ',
			description: 'letter f with hook'
		},
		{
			decimal: '160',
			octal: '240',
			hex: 'A0',
			binary: '1010 0000',
			value: 'á',
			description: 'letter a with acute'
		},
		{
			decimal: '161',
			octal: '241',
			hex: 'A1',
			binary: '1010 0001',
			value: 'í',
			description: 'letter i with acute'
		},
		{
			decimal: '162',
			octal: '242',
			hex: 'A2',
			binary: '1010 0010',
			value: 'ó',
			description: 'letter o with acute'
		},
		{
			decimal: '163',
			octal: '243',
			hex: 'A3',
			binary: '1010 0011',
			value: 'ú',
			description: 'letter u with acute'
		},
		{
			decimal: '164',
			octal: '244',
			hex: 'A4',
			binary: '1010 0100',
			value: 'ñ',
			description: 'letter n with tilde'
		},
		{
			decimal: '165',
			octal: '245',
			hex: 'A5',
			binary: '1010 0101',
			value: 'Ñ',
			description: 'capital letter n with tilde'
		},
		{
			decimal: '166',
			octal: '246',
			hex: 'A6',
			binary: '1010 0110',
			value: 'ª',
			description: 'feminine ordinal indicator'
		},
		{
			decimal: '167',
			octal: '247',
			hex: 'A7',
			binary: '1010 0111',
			value: 'º',
			description: 'masculine ordinal indicator'
		},
		{
			decimal: '168',
			octal: '250',
			hex: 'A8',
			binary: '1010 1000',
			value: '¿',
			description: 'inverted question mark'
		},
		{
			decimal: '169',
			octal: '251',
			hex: 'A9',
			binary: '1010 1001',
			value: '⌐',
			description: 'reversed not sign'
		},
		{
			decimal: '170',
			octal: '252',
			hex: 'AA',
			binary: '1010 1010',
			value: '¬',
			description: 'not sign'
		},
		{
			decimal: '171',
			octal: '253',
			hex: 'AB',
			binary: '1010 1011',
			value: '½',
			description: 'one half'
		},
		{
			decimal: '172',
			octal: '254',
			hex: 'AC',
			binary: '1010 1100',
			value: '¼',
			description: 'one quarter'
		},
		{
			decimal: '173',
			octal: '255',
			hex: 'AD',
			binary: '1010 1101',
			value: '¡',
			description: 'inverted exclamation mark'
		},
		{
			decimal: '174',
			octal: '256',
			hex: 'AE',
			binary: '1010 1110',
			value: '«',
			description: 'left double angle quotation mark'
		},
		{
			decimal: '175',
			octal: '257',
			hex: 'AF',
			binary: '1010 1111',
			value: '»',
			description: 'right double angle quotation mark'
		},
		{
			decimal: '176',
			octal: '260',
			hex: 'B0',
			binary: '1011 0000',
			value: '░',
			description: 'light shade'
		},
		{
			decimal: '177',
			octal: '261',
			hex: 'B1',
			binary: '1011 0001',
			value: '▒',
			description: 'medium shade'
		},
		{
			decimal: '178',
			octal: '262',
			hex: 'B2',
			binary: '1011 0010',
			value: '▓',
			description: 'dark shade'
		},
		{
			decimal: '179',
			octal: '263',
			hex: 'B3',
			binary: '1011 0011',
			value: '│',
			description: 'single vertical'
		},
		{
			decimal: '180',
			octal: '264',
			hex: 'B4',
			binary: '1011 0100',
			value: '┤',
			description: 'single vertical and left'
		},
		{
			decimal: '181',
			octal: '265',
			hex: 'B5',
			binary: '1011 0101',
			value: '╡',
			description: 'single vertical and double left'
		},
		{
			decimal: '182',
			octal: '266',
			hex: 'B6',
			binary: '1011 0110',
			value: '╢',
			description: 'double vertical and single left'
		},
		{
			decimal: '183',
			octal: '267',
			hex: 'B7',
			binary: '1011 0111',
			value: '╖',
			description: 'double down and single left'
		},
		{
			decimal: '184',
			octal: '270',
			hex: 'B8',
			binary: '1011 1000',
			value: '╕',
			description: 'single down and double left'
		},
		{
			decimal: '185',
			octal: '271',
			hex: 'B9',
			binary: '1011 1001',
			value: '╣',
			description: 'double vertical and left'
		},
		{
			decimal: '186',
			octal: '272',
			hex: 'BA',
			binary: '1011 1010',
			value: '║',
			description: 'double vertical'
		},
		{
			decimal: '187',
			octal: '273',
			hex: 'BB',
			binary: '1011 1011',
			value: '╗',
			description: 'double down and left'
		},
		{
			decimal: '188',
			octal: '274',
			hex: 'BC',
			binary: '1011 1100',
			value: '╝',
			description: 'double up and left'
		},
		{
			decimal: '189',
			octal: '275',
			hex: 'BD',
			binary: '1011 1101',
			value: '╜',
			description: 'double up and single left'
		},
		{
			decimal: '190',
			octal: '276',
			hex: 'BE',
			binary: '1011 1110',
			value: '╛',
			description: 'single up and double left'
		},
		{
			decimal: '191',
			octal: '277',
			hex: 'BF',
			binary: '1011 1111',
			value: '┐',
			description: 'single down and left'
		},
		{
			decimal: '192',
			octal: '300',
			hex: 'C0',
			binary: '1100 0000',
			value: '└',
			description: 'single up and right'
		},
		{
			decimal: '193',
			octal: '301',
			hex: 'C1',
			binary: '1100 0001',
			value: '┴',
			description: 'single up and horizontal'
		},
		{
			decimal: '194',
			octal: '302',
			hex: 'C2',
			binary: '1100 0010',
			value: '┬',
			description: 'single down and horizontal'
		},
		{
			decimal: '195',
			octal: '303',
			hex: 'C3',
			binary: '1100 0011',
			value: '├',
			description: 'single vertical and right'
		},
		{
			decimal: '196',
			octal: '304',
			hex: 'C4',
			binary: '1100 0100',
			value: '─',
			description: 'single horizontal'
		},
		{
			decimal: '197',
			octal: '305',
			hex: 'C5',
			binary: '1100 0101',
			value: '┼',
			description: 'single vertical and horizontal'
		},
		{
			decimal: '198',
			octal: '306',
			hex: 'C6',
			binary: '1100 0110',
			value: '╞',
			description: 'single vertical and double right'
		},
		{
			decimal: '199',
			octal: '307',
			hex: 'C7',
			binary: '1100 0111',
			value: '╟',
			description: 'double vertical and single right'
		},
		{
			decimal: '200',
			octal: '310',
			hex: 'C8',
			binary: '1100 1000',
			value: '╚',
			description: 'double up and right'
		},
		{
			decimal: '201',
			octal: '311',
			hex: 'C9',
			binary: '1100 1001',
			value: '╔',
			description: 'double down and right'
		},
		{
			decimal: '202',
			octal: '312',
			hex: 'CA',
			binary: '1100 1010',
			value: '╩',
			description: 'double up and horizontal'
		},
		{
			decimal: '203',
			octal: '313',
			hex: 'CB',
			binary: '1100 1011',
			value: '╦',
			description: 'double down and horizontal'
		},
		{
			decimal: '204',
			octal: '314',
			hex: 'CC',
			binary: '1100 1100',
			value: '╠',
			description: 'double vertical and right'
		},
		{
			decimal: '205',
			octal: '315',
			hex: 'CD',
			binary: '1100 1101',
			value: '═',
			description: 'double horizontal'
		},
		{
			decimal: '206',
			octal: '316',
			hex: 'CE',
			binary: '1100 1110',
			value: '╬',
			description: 'double vertical and horizontal'
		},
		{
			decimal: '207',
			octal: '317',
			hex: 'CF',
			binary: '1100 1111',
			value: '╧',
			description: 'single up and double horizontal'
		},
		{
			decimal: '208',
			octal: '320',
			hex: 'D0',
			binary: '1101 0000',
			value: '╨',
			description: 'double up and single horizontal'
		},
		{
			decimal: '209',
			octal: '321',
			hex: 'D1',
			binary: '1101 0001',
			value: '╤',
			description: 'single down and double horizontal'
		},
		{
			decimal: '210',
			octal: '322',
			hex: 'D2',
			binary: '1101 0010',
			value: '╥',
			description: 'double down and single horizontal'
		},
		{
			decimal: '211',
			octal: '323',
			hex: 'D3',
			binary: '1101 0011',
			value: '╙',
			description: 'double up and single right'
		},
		{
			decimal: '212',
			octal: '324',
			hex: 'D4',
			binary: '1101 0100',
			value: '╘',
			description: 'single up and double right'
		},
		{
			decimal: '213',
			octal: '325',
			hex: 'D5',
			binary: '1101 0101',
			value: '╒',
			description: 'single down and double right'
		},
		{
			decimal: '214',
			octal: '326',
			hex: 'D6',
			binary: '1101 0110',
			value: '╓',
			description: 'double down and single right'
		},
		{
			decimal: '215',
			octal: '327',
			hex: 'D7',
			binary: '1101 0111',
			value: '╫',
			description: 'double vertical and single horizontal'
		},
		{
			decimal: '216',
			octal: '330',
			hex: 'D8',
			binary: '1101 1000',
			value: '╪',
			description: 'single vertical and double horizontal'
		},
		{
			decimal: '217',
			octal: '331',
			hex: 'D9',
			binary: '1101 1001',
			value: '┘',
			description: 'single up and left'
		},
		{
			decimal: '218',
			octal: '332',
			hex: 'DA',
			binary: '1101 1010',
			value: '┌',
			description: 'single down and right'
		},
		{
			decimal: '219',
			octal: '333',
			hex: 'DB',
			binary: '1101 1011',
			value: '█',
			description: 'full block'
		},
		{
			decimal: '220',
			octal: '334',
			hex: 'DC',
			binary: '1101 1100',
			value: '▄',
			description: 'bottom half block'
		},
		{
			decimal: '221',
			octal: '335',
			hex: 'DD',
			binary: '1101 1101',
			value: '▌',
			description: 'left half block'
		},
		{
			decimal: '222',
			octal: '336',
			hex: 'DE',
			binary: '1101 1110',
			value: '▐',
			description: 'right half block'
		},
		{
			decimal: '223',
			octal: '337',
			hex: 'DF',
			binary: '1101 1111',
			value: '▀',
			description: 'top half block'
		},
		{
			decimal: '224',
			octal: '340',
			hex: 'E0',
			binary: '1110 0000',
			value: 'α',
			description: 'greek letter alpha'
		},
		{
			decimal: '225',
			octal: '341',
			hex: 'E1',
			binary: '1110 0001',
			value: 'ß',
			description: 'letter sharp s'
		},
		{
			decimal: '226',
			octal: '342',
			hex: 'E2',
			binary: '1110 0010',
			value: 'Γ',
			description: 'greek capital letter gamma'
		},
		{
			decimal: '227',
			octal: '343',
			hex: 'E3',
			binary: '1110 0011',
			value: 'π',
			description: 'greek letter pi'
		},
		{
			decimal: '228',
			octal: '344',
			hex: 'E4',
			binary: '1110 0100',
			value: 'Σ',
			description: 'greek capital letter sigma'
		},
		{
			decimal: '229',
			octal: '345',
			hex: 'E5',
			binary: '1110 0101',
			value: 'σ',
			description: 'greek letter sigma'
		},
		{
			decimal: '230',
			octal: '346',
			hex: 'E6',
			binary: '1110 0110',
			value: 'µ',
			description: 'micro sign'
		},
		{
			decimal: '231',
			octal: '347',
			hex: 'E7',
			binary: '1110 0111',
			value: 'τ',
			description: 'greek letter tau'
		},
		{
			decimal: '232',
			octal: '350',
			hex: 'E8',
			binary: '1110 1000',
			value: 'Φ',
			description: 'greek capital letter phi'
		},
		{
			decimal: '233',
			octal: '351',
			hex: 'E9',
			binary: '1110 1001',
			value: 'Θ',
			description: 'greek capital letter theta'
		},
		{
			decimal: '234',
			octal: '352',
			hex: 'EA',
			binary: '1110 1010',
			value: 'Ω',
			description: 'greek capital letter omega'
		},
		{
			decimal: '235',
			octal: '353',
			hex: 'EB',
			binary: '1110 1011',
			value: 'δ',
			description: 'greek letter delta'
		},
		{
			decimal: '236',
			octal: '354',
			hex: 'EC',
			binary: '1110 1100',
			value: '∞',
			description: 'infinity'
		},
		{
			decimal: '237',
			octal: '355',
			hex: 'ED',
			binary: '1110 1101',
			value: 'φ',
			description: 'greek letter phi'
		},
		{
			decimal: '238',
			octal: '356',
			hex: 'EE',
			binary: '1110 1110',
			value: 'ε',
			description: 'greek letter epsilon'
		},
		{
			decimal: '239',
			octal: '357',
			hex: 'EF',
			binary: '1110 1111',
			value: '∩',
			description: 'intersection'
		},
		{
			decimal: '240',
			octal: '360',
			hex: 'F0',
			binary: '1111 0000',
			value: '≡',
			description: 'identical to'
		},
		{
			decimal: '241',
			octal: '361',
			hex: 'F1',
			binary: '1111 0001',
			value: '±',
			description: 'plus-minus sign'
		},
		{
			decimal: '242',
			octal: '362',
			hex: 'F2',
			binary: '1111 0010',
			value: '≥',
			description: 'greater than or equal to'
		},
		{
			decimal: '243',
			octal: '363',
			hex: 'F3',
			binary: '1111 0011',
			value: '≤',
			description: 'less than or equal to'
		},
		{
			decimal: '244',
			octal: '364',
			hex: 'F4',
			binary: '1111 0100',
			value: '⌠',
			description: 'top half integral'
		},
		{
			decimal: '245',
			octal: '365',
			hex: 'F5',
			binary: '1111 0101',
			value: '⌡',
			description: 'bottom half integral'
		},
		{
			decimal: '246',
			octal: '366',
			hex: 'F6',
			binary: '1111 0110',
			value: '÷',
			description: 'division sign'
		},
		{
			decimal: '247',
			octal: '367',
			hex: 'F7',
			binary: '1111 0111',
			value: '≈',
			description: 'almost equal to'
		},
		{
			decimal: '248',
			octal: '370',
			hex: 'F8',
			binary: '1111 1000',
			value: '°',
			description: 'degree sign'
		},
		{
			decimal: '249',
			octal: '371',
			hex: 'F9',
			binary: '1111 1001',
			value: '∙',
			description: 'bullet operator'
		},
		{
			decimal: '250',
			octal: '372',
			hex: 'FA',
			binary: '1111 1010',
			value: '·',
			description: 'middle dot'
		},
		{
			decimal: '251',
			octal: '373',
			hex: 'FB',
			binary: '1111 1011',
			value: '√',
			description: 'square root'
		},
		{
			decimal: '252',
			octal: '374',
			hex: 'FC',
			binary: '1111 1100',
			value: 'ⁿ',
			description: 'superscript n'
		},
		{
			decimal: '253',
			octal: '375',
			hex: 'FD',
			binary: '1111 1101',
			value: '²',
			description: 'superscript 2'
		},
		{
			decimal: '254',
			octal: '376',
			hex: 'FE',
			binary: '1111 1110',
			value: '■',
			description: 'black square'
		},
		{
			decimal: '255',
			octal: '377',
			hex: 'FF',
			binary: '1111 1111',
			value: '',
			description: 'no-break space'
		}
	];

	const buildRows = () => {
		const controlMap = new Map(controlCodes.map((item) => [item.code, item]));
		const rows = [];
		for (let code = 0; code <= 127; code += 1) {
			const control = controlMap.get(code);
			let value = control?.value || String.fromCharCode(code);
			let description = control?.description || '';
			if (!control) {
				if (code >= 65 && code <= 90) {
					description = `uppercase letter ${value}`;
				} else if (code >= 97 && code <= 122) {
					description = `lowercase letter ${value}`;
				} else if (code >= 48 && code <= 57) {
					description = `digit ${value}`;
				} else {
					description = punctuationDescriptions[code] || description;
				}
			}
			rows.push({
				decimal: code.toString(10).padStart(3, '0'),
				octal: code.toString(8).padStart(3, '0'),
				hex: code.toString(16).toUpperCase().padStart(2, '0'),
				binary: formatBinary(code),
				value,
				description
			});
		}
		return rows.concat(extendedAscii);
	};

	const ASCII_REF = buildRows();

	let query = '';

	$: normalizedQuery = query.trim().toLowerCase();
	$: filteredRows =
		normalizedQuery.length === 0
			? ASCII_REF
			: ASCII_REF.filter((row) =>
					[row.decimal, row.octal, row.hex, row.binary, row.value, row.description]
						.join(' ')
						.toLowerCase()
						.includes(normalizedQuery)
				);
</script>

<div class="min-h-screen">
	<div class="mx-auto flex max-w-[1200px] flex-col gap-6 px-6 py-8">
		<header class="space-y-2">
			<a class="back-link" href="/">
				<span aria-hidden="true">←</span>
				Back to toolbox
			</a>
			<h1 class="text-3xl font-semibold">ASCII Reference Table</h1>
			<p class="text-sm text-[var(--color-muted)]">Standard ASCII (0-127) lookup table.</p>
		</header>

		<section class="panel space-y-5 p-6">
			<label class="space-y-2 text-sm">
				<span class="text-[var(--color-muted)]">Search</span>
				<input
					type="search"
					class="search-input"
					placeholder="Search by code, hex, or description"
					bind:value={query}
				/>
			</label>

			<div class="panel panel-muted overflow-x-auto p-4">
				<table class="w-full min-w-[880px] text-left text-sm">
					<thead class="text-xs text-[var(--color-muted)] uppercase">
						<tr>
							<th class="pr-4 pb-3">Dec</th>
							<th class="pr-4 pb-3">Oct</th>
							<th class="pr-4 pb-3">Hex</th>
							<th class="pr-4 pb-3">Binary</th>
							<th class="pr-4 pb-3">Value</th>
							<th class="pb-3">Description</th>
						</tr>
					</thead>
					<tbody class="divide-y divide-[var(--color-border)]">
						{#each filteredRows as row}
							<tr>
								<td class="py-2 pr-4 font-mono text-xs">{row.decimal}</td>
								<td class="py-2 pr-4 font-mono text-xs">{row.octal}</td>
								<td class="py-2 pr-4 font-mono text-xs">{row.hex}</td>
								<td class="py-2 pr-4 font-mono text-xs">{row.binary}</td>
								<td class="py-2 pr-4 font-mono text-xs">{row.value}</td>
								<td class="py-2 text-xs text-[var(--color-muted)]">{row.description || '--'}</td>
							</tr>
						{/each}
					</tbody>
				</table>
			</div>
		</section>
	</div>
</div>
