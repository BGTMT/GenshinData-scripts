require('./global.js');

const xconstellation = getExcel('AvatarTalentExcelConfigData');

function collateConstellation(lang) {
	const language = getLanguage(lang);
	let myconstellation = xplayableAvatar.reduce((accum, obj) => {
		// bad practice to declare functions inside loop but i need to be able to call it multiple times for players
		function dowork() {
			let data = {};
			data.id = obj.skillDepotId;
			let depot = xskilldepot.find(ele => ele.id === obj.skillDepotId);
			if(depot === undefined || depot.energySkill === undefined) return; // not a finished (traveler) character
			if(depot.talentStarName === '') return; // unfinished

			data.name = language[obj.nameTextMapHash];
			if(isPlayer(obj)) data.name += ` (${language[elementTextMapHash[getPlayerElement(obj.skillDepotId)]]})`

			data.images = {};
			let stars = depot.talents.map(talentId => xconstellation.find(ele => ele.talentId === talentId));
			for(let i = 1; i <= 6; i++) {
				data['c'+i] = {
					name: sanitizer(language[stars[i-1].nameTextMapHash], replaceNonBreakSpace, removeHashtag),
					descriptionRaw: sanitizer(language[stars[i-1].descTextMapHash], replaceNewline)
				};
				data['c'+i].description = sanitizer(data['c'+i].descriptionRaw, replaceNonBreakSpace, removeColorHTML, replaceLayoutPC, replaceGenderM, removeHashtag);
				validateString(data['c'+i].name, 'constellations.name', lang);
				validateString(data['c'+i].description, 'constellations.description', lang);

				data.images['filename_c'+i] = stars[i-1].icon;
			}

			let rx = /UI_Talent_[^_]*_([^_]*)/;
			let extract = rx.exec(data.images.filename_c1)[1];
			if(!extract.startsWith('Player')) {
				data.images.filename_constellation = `Eff_UI_Talent_${extract}`;
			} else {
				let element = /Player(.*)/.exec(extract)[1];
				data.images.filename_constellation = `Eff_UI_Talent_PlayerBoy_${element}`;
				data.images.filename_constellation2 = `Eff_UI_Talent_PlayerGirl_${element}`;
			}

			accum[avatarIdToFileName[isPlayer(obj) ? obj.skillDepotId : obj.id]] = data;
		}

		if(isPlayer(obj)) {
			obj.candSkillDepotIds.forEach(ele => {
				obj.skillDepotId = ele;
				dowork();
			});
		} else {
			dowork();
		}
		return accum;
	}, {});
	return myconstellation;
}

module.exports = collateConstellation;