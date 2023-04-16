/**
 * Parse profile.
 *
 * @param {object|string} json
 * @return {object}
 * @access public
 */
exports.parse = function(json) {
  if ('string' == typeof json) {
    json = JSON.parse(json);
  }
  
  var profile = {};
  profile.id = json.id;
  profile.username = json.nickname;
  profile.displayName = json.name;
  profile.name = { familyName: json.last_name,
                   givenName: json.first_name };

  profile.gender = json.gender;
  profile.profileUrl = json.link;
  
  if (json.email) {
    profile.emails = [{ value: json.email }];
  }
  
  if (json.image) {
      profile.photos = [{ value: json.image }];
  }
  
  return profile;
};
