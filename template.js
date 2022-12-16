require('./global.js');

const xmat = getExcel('MaterialExcelConfigData');

// const propImage = getPropNameWithMatch(xdetail, 'id', 1001, "UI_Gcg_InSide_01");

const skipdupelog = [];
function collate(lang) {
	const language = getLanguage(lang);
	const dupeCheck = {};
	let mydata = .reduce((accum, obj) => {
		let data = {};
		data.id = obj.id;

		data.name = language[obj.nameTextMapHash];
		data.description = sanitizeDescription(language[obj.descTextMapHash]);



		let filename = makeUniqueFileName(obj.nameTextMapHash, accum);
		if(filename === '') return accum;
		checkDupeName(data, dupeCheck, skipdupelog);
		accum[filename] = data;

		return accum;
	}, {});

	return mydata;
}

module.exports = collate;